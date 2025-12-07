use anyhow::Result;
use regex::Regex;
use std::fs;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PythonVersion {
    Python2,
    Python3,
    Python,
}

impl PythonVersion {
    #[allow(dead_code)]
    pub fn command(&self) -> &str {
        match self {
            PythonVersion::Python2 => "python2",
            PythonVersion::Python3 => "python3",
            PythonVersion::Python => "python",
        }
    }
}

pub fn detect_python_version(script_path: &str) -> Result<PythonVersion> {
    let content = fs::read_to_string(script_path)?;
    let lines: Vec<&str> = content.lines().take(10).collect();

    // Check shebang
    if let Some(first_line) = lines.first() {
        if first_line.starts_with("#!") {
            if first_line.contains("python2") {
                return Ok(PythonVersion::Python2);
            }
            if first_line.contains("python3") {
                return Ok(PythonVersion::Python3);
            }
            if first_line.contains("python") {
                return Ok(PythonVersion::Python);
            }
        }
    }

    // Check imports in first few lines
    let content_sample = lines.join("\n");
    let py2_patterns = [
        Regex::new("print\\s+")?,
        Regex::new("xrange")?,
        Regex::new("unicode\\(")?,
    ];

    let py3_patterns = [
        Regex::new("print\\(")?,
        Regex::new("f['\"]")?,
        Regex::new("async\\s+")?,
    ];

    let mut py2_score = 0;
    let mut py3_score = 0;

    for pattern in &py2_patterns {
        if pattern.is_match(&content_sample) {
            py2_score += 1;
        }
    }

    for pattern in &py3_patterns {
        if pattern.is_match(&content_sample) {
            py3_score += 1;
        }
    }

    if py2_score > py3_score {
        Ok(PythonVersion::Python2)
    } else if py3_score > py2_score {
        Ok(PythonVersion::Python3)
    } else {
        Ok(PythonVersion::Python)
    }
}
