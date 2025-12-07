use anyhow::{anyhow, Result};
use std::fs;
use std::process::Command;
use uuid::Uuid;

use crate::python::detect_python_version;
use crate::storage::{ContainerConfig, Storage};

pub struct ContainerManager {
    storage: Storage,
}

impl ContainerManager {
    pub fn new(storage: Storage) -> Self {
        ContainerManager { storage }
    }

    pub async fn create(&self, name: &str, script: &str) -> Result<()> {
        if self.storage.container_exists(name) {
            return Err(anyhow!("Container '{}' already exists", name));
        }

        if !std::path::Path::new(script).exists() {
            return Err(anyhow!("Script '{}' not found", script));
        }

        let python_version = detect_python_version(script)?;
        let id = Uuid::new_v4().to_string();

        let config = ContainerConfig {
            id,
            name: name.to_string(),
            script: script.to_string(),
            python_version: format!("{:?}", python_version),
            status: "stopped".to_string(),
            port_mapping: None,
        };

        self.storage.save_config(&config)?;

        let fs_path = self.storage.filesystem_path(name);
        fs::create_dir_all(&fs_path)?;

        println!("✓ Container '{}' created (Python: {:?})", name, python_version);
        Ok(())
    }

    pub async fn start(&self, name: &str, port: Option<String>) -> Result<()> {
        let mut config = self.storage.load_config(name)?;

        if config.status == "running" {
            return Err(anyhow!("Container '{}' is already running", name));
        }

        config.status = "running".to_string();
        config.port_mapping = port.clone();
        self.storage.save_config(&config)?;

        let script = &config.script;
        let python_cmd = match config.python_version.as_str() {
            "Python2" => "python2",
            "Python3" => "python3",
            _ => "python",
        };

        let logs_path = self.storage.logs_path(name);
        let log_file = fs::File::create(&logs_path)?;

        let mut cmd = Command::new("proot");
        cmd.arg("-r")
            .arg(self.storage.filesystem_path(name))
            .arg(python_cmd)
            .arg(script);

        if let Some(port_map) = &port {
            cmd.env("DOCK_PORT_MAP", port_map);
        }

        cmd.env("DOCK_CONTAINER", name);

        let child = cmd
            .stdout(log_file.try_clone()?)
            .stderr(log_file)
            .spawn()?;

        println!("✓ Container '{}' started (PID: {})", name, child.id());
        if let Some(p) = port {
            println!("  Port mapping: {}", p);
        }

        Ok(())
    }

    pub async fn stop(&self, name: &str) -> Result<()> {
        let mut config = self.storage.load_config(name)?;

        if config.status == "stopped" {
            return Err(anyhow!("Container '{}' is already stopped", name));
        }

        config.status = "stopped".to_string();
        self.storage.save_config(&config)?;

        Command::new("pkill")
            .arg("-f")
            .arg(format!("DOCK_CONTAINER={}", name))
            .output()?;

        println!("✓ Container '{}' stopped", name);
        Ok(())
    }

    pub async fn list(&self) -> Result<()> {
        let containers = self.storage.list_containers()?;

        if containers.is_empty() {
            println!("No containers found");
            return Ok(());
        }

        println!("{:<20} {:<15} {:<20} {:<15}", "NAME", "STATUS", "PYTHON", "PORT");
        println!("{}", "-".repeat(70));

        for config in containers {
            let port = config.port_mapping.unwrap_or_else(|| "-".to_string());
            println!(
                "{:<20} {:<15} {:<20} {:<15}",
                config.name, config.status, config.python_version, port
            );
        }

        Ok(())
    }

    pub async fn enter(&self, name: &str) -> Result<()> {
        if !self.storage.container_exists(name) {
            return Err(anyhow!("Container '{}' not found", name));
        }

        let fs_path = self.storage.filesystem_path(name);

        // Try bash first, fall back to sh
        let shell = if Command::new("which").arg("bash").output()?.status.success() {
            "bash"
        } else {
            "sh"
        };

        Command::new(shell)
            .current_dir(&fs_path)
            .env("DOCK_CONTAINER", name)
            .env("DOCK_ROOT", &fs_path)
            .spawn()?
            .wait()?;

        Ok(())
    }

    pub async fn logs(&self, name: &str) -> Result<()> {
        let logs_path = self.storage.logs_path(name);

        if !logs_path.exists() {
            println!("No logs available for container '{}'", name);
            return Ok(());
        }

        let content = fs::read_to_string(logs_path)?;
        println!("{}", content);
        Ok(())
    }

    pub async fn remove(&self, name: &str) -> Result<()> {
        let config = self.storage.load_config(name)?;

        if config.status == "running" {
            return Err(anyhow!(
                "Cannot remove running container '{}'. Stop it first.",
                name
            ));
        }

        self.storage.delete_container(name)?;
        println!("✓ Container '{}' removed", name);
        Ok(())
    }
}
