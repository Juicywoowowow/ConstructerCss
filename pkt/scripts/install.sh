#!/bin/bash

# Colors
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
RESET='\033[0m'

PKT_HOME="$HOME/.pkt"
PKT_BIN="$PKT_HOME/bin"
PKT_SRC="$PKT_HOME/src"
PKT_INSTALLED="$PKT_HOME/installed.json"

PACKAGE="$1"
MODE="$2"  # "update" if updating

# Package definitions
declare -A REPOS
declare -A BUILDS
declare -A BINARIES

REPOS["neofetch"]="https://github.com/dylanaraps/neofetch.git"
BUILDS["neofetch"]="make PREFIX=$PKT_HOME install"
BINARIES["neofetch"]="neofetch"

REPOS["htop"]="https://github.com/htop-dev/htop.git"
BUILDS["htop"]="./autogen.sh && ./configure --prefix=$PKT_HOME && make && make install"
BINARIES["htop"]="htop"

REPOS["micro"]="https://github.com/zyedidia/micro.git"
BUILDS["micro"]="make build && cp micro $PKT_BIN/"
BINARIES["micro"]="micro"

REPOS["fzf"]="https://github.com/junegunn/fzf.git"
BUILDS["fzf"]="./install --bin && cp bin/fzf $PKT_BIN/"
BINARIES["fzf"]="fzf"

REPOS["jq"]="https://github.com/stedolan/jq.git"
BUILDS["jq"]="autoreconf -i && ./configure --prefix=$PKT_HOME && make && make install"
BINARIES["jq"]="jq"

if [ -z "$PACKAGE" ]; then
    echo -e "${RED}Error: No package specified${RESET}"
    exit 1
fi

REPO="${REPOS[$PACKAGE]}"
BUILD="${BUILDS[$PACKAGE]}"

if [ -z "$REPO" ]; then
    echo -e "${RED}Error: Unknown package '$PACKAGE'${RESET}"
    exit 1
fi

# Create directories
mkdir -p "$PKT_BIN" "$PKT_SRC"

cd "$PKT_SRC"

# Clone or update
if [ -d "$PACKAGE" ]; then
    if [ "$MODE" == "update" ]; then
        echo -e "${CYAN}Updating $PACKAGE...${RESET}"
        cd "$PACKAGE"
        git pull
    else
        echo -e "${YELLOW}Source already exists, rebuilding...${RESET}"
        cd "$PACKAGE"
    fi
else
    echo -e "${CYAN}Cloning $PACKAGE...${RESET}"
    git clone "$REPO" "$PACKAGE"
    cd "$PACKAGE"
fi

# Build
echo -e "${CYAN}Building $PACKAGE...${RESET}"
eval "$BUILD"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully installed $PACKAGE${RESET}"
    
    # Update installed.json
    if [ ! -f "$PKT_INSTALLED" ]; then
        echo '{"installed":[]}' > "$PKT_INSTALLED"
    fi
    
    # Add to installed list if not already there
    if ! grep -q "\"$PACKAGE\"" "$PKT_INSTALLED"; then
        sed -i "s/\[/[\"$PACKAGE\",/" "$PKT_INSTALLED"
        sed -i 's/,]/]/' "$PKT_INSTALLED"
    fi
    
    exit 0
else
    echo -e "${RED}Build failed for $PACKAGE${RESET}"
    exit 1
fi
