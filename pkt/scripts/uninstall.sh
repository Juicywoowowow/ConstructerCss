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

# Binary names for each package
declare -A BINARIES
BINARIES["nnn"]="nnn"
BINARIES["lazygit"]="lazygit"
BINARIES["gotop"]="gotop"
BINARIES["lf"]="lf"
BINARIES["croc"]="croc"
BINARIES["glow"]="glow"
BINARIES["bat"]="bat"
BINARIES["termux-api"]="termux-api"
BINARIES["termux-styling"]="termux-styling"
BINARIES["termux-boot"]="termux-boot"

if [ -z "$PACKAGE" ]; then
    echo -e "${RED}Error: No package specified${RESET}"
    exit 1
fi

BINARY="${BINARIES[$PACKAGE]}"

echo -e "${CYAN}Uninstalling $PACKAGE...${RESET}"

# Remove binary
if [ -f "$PKT_BIN/$BINARY" ]; then
    rm -f "$PKT_BIN/$BINARY"
    echo -e "${GREEN}Removed binary${RESET}"
fi

# Remove source
if [ -d "$PKT_SRC/$PACKAGE" ]; then
    rm -rf "$PKT_SRC/$PACKAGE"
    echo -e "${GREEN}Removed source${RESET}"
fi

# Update installed.json
if [ -f "$PKT_INSTALLED" ]; then
    sed -i "s/\"$PACKAGE\",//" "$PKT_INSTALLED"
    sed -i "s/,\"$PACKAGE\"//" "$PKT_INSTALLED"
    sed -i "s/\"$PACKAGE\"//" "$PKT_INSTALLED"
fi

echo -e "${GREEN}Uninstalled $PACKAGE${RESET}"
exit 0
