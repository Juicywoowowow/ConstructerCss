#!/bin/bash

# Colors
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
RESET='\033[0m'

PKT_HOME="$HOME/.pkt"
PKT_SRC="$PKT_HOME/src"

PACKAGE="$1"

if [ -z "$PACKAGE" ]; then
    echo -e "${RED}Error: No package specified${RESET}"
    exit 2
fi

if [ ! -d "$PKT_SRC/$PACKAGE" ]; then
    echo -e "${RED}Package source not found${RESET}"
    exit 2
fi

cd "$PKT_SRC/$PACKAGE"

# Fetch latest
git fetch origin

# Compare local and remote
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo -e "${YELLOW}Update available for $PACKAGE${RESET}"
    exit 1  # Update available
else
    echo -e "${GREEN}$PACKAGE is up to date${RESET}"
    exit 0  # No update
fi
