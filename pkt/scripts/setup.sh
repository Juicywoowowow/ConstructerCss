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

echo -e "${CYAN}Setting up Pkt...${RESET}"

# Create directories
mkdir -p "$PKT_BIN" "$PKT_SRC"

# Initialize installed.json
if [ ! -f "$PKT_HOME/installed.json" ]; then
    echo '{"installed":[]}' > "$PKT_HOME/installed.json"
fi

# Add to PATH in shell config
SHELL_RC=""
if [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
elif [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
fi

if [ -n "$SHELL_RC" ]; then
    if ! grep -q "PKT_BIN" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# Pkt package manager" >> "$SHELL_RC"
        echo "export PATH=\"\$HOME/.pkt/bin:\$PATH\"" >> "$SHELL_RC"
        echo -e "${GREEN}Added ~/.pkt/bin to PATH in $SHELL_RC${RESET}"
        echo -e "${YELLOW}Run 'source $SHELL_RC' or restart terminal${RESET}"
    else
        echo -e "${GREEN}PATH already configured${RESET}"
    fi
fi

echo -e "${GREEN}Setup complete!${RESET}"
echo -e "${CYAN}Run 'pkt' to start the package manager${RESET}"
