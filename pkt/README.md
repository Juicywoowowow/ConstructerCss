# Pkt

A simple, colorful package manager for Termux.

## Features

- Interactive menu with arrow key navigation
- Colored status indicators (green = installed, yellow = update available)
- Git-based package installation
- Update checking via git
- Uninstall support
- Packages compiled from source

## Installation

```bash
# Clone the repo
git clone https://github.com/Juicywoowowow/Packager-Pkt-.git
cd Packager-Pkt-

# Build and install
make
make install

# Reload shell config
source ~/.bashrc  # or ~/.zshrc
```

## Usage

```bash
pkt
```

### Controls

| Key | Action |
|-----|--------|
| ↑/↓ or j/k | Navigate |
| Enter | Install selected package |
| u | Check for updates |
| d | Uninstall package |
| q | Quit |

## Available Packages

- neofetch - System info display
- htop - Process viewer
- micro - Terminal text editor
- fzf - Fuzzy finder
- jq - JSON processor

## File Structure

```
~/.pkt/
├── bin/          # Installed binaries
├── src/          # Cloned source repos
├── scripts/      # Install/uninstall scripts
├── packages.json # Package definitions
└── installed.json # Tracking file
```

## Requirements

- Termux (or any Linux environment)
- gcc
- git
- make
- Build dependencies for individual packages

## License

MIT
