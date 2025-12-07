use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerConfig {
    pub id: String,
    pub name: String,
    pub script: String,
    pub python_version: String,
    pub status: String,
    pub port_mapping: Option<String>,
}

pub struct Storage {
    base_path: PathBuf,
}

impl Storage {
    pub fn new() -> Result<Self> {
        let base_path = dirs::home_dir()
            .ok_or(anyhow!("Could not determine home directory"))?
            .join(".dock");

        fs::create_dir_all(&base_path)?;
        fs::create_dir_all(base_path.join("containers"))?;

        Ok(Storage { base_path })
    }

    pub fn container_dir(&self, name: &str) -> PathBuf {
        self.base_path.join("containers").join(name)
    }

    pub fn config_path(&self, name: &str) -> PathBuf {
        self.container_dir(name).join("config.json")
    }

    pub fn filesystem_path(&self, name: &str) -> PathBuf {
        self.container_dir(name).join("fs")
    }

    pub fn logs_path(&self, name: &str) -> PathBuf {
        self.container_dir(name).join("logs.txt")
    }

    pub fn save_config(&self, config: &ContainerConfig) -> Result<()> {
        let dir = self.container_dir(&config.name);
        fs::create_dir_all(&dir)?;
        let path = self.config_path(&config.name);
        let json = serde_json::to_string_pretty(config)?;
        fs::write(path, json)?;
        Ok(())
    }

    pub fn load_config(&self, name: &str) -> Result<ContainerConfig> {
        let path = self.config_path(name);
        let json = fs::read_to_string(path)?;
        Ok(serde_json::from_str(&json)?)
    }

    pub fn list_containers(&self) -> Result<Vec<ContainerConfig>> {
        let containers_dir = self.base_path.join("containers");
        let mut configs = Vec::new();

        for entry in fs::read_dir(containers_dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                if let Ok(name) = path.file_name().ok_or(anyhow!("No filename")).map(|n| n.to_string_lossy().to_string()) {
                    if let Ok(config) = self.load_config(&name) {
                        configs.push(config);
                    }
                }
            }
        }

        Ok(configs)
    }

    pub fn container_exists(&self, name: &str) -> bool {
        self.config_path(name).exists()
    }

    pub fn delete_container(&self, name: &str) -> Result<()> {
        let dir = self.container_dir(name);
        if dir.exists() {
            fs::remove_dir_all(dir)?;
        }
        Ok(())
    }
}
