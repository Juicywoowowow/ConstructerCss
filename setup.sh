#!/bin/bash

# Setup script for Dock - adds dock command to shell

DOCK_BIN="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/target/release/dock"

if [ ! -f "$DOCK_BIN" ]; then
    echo "Error: Dock binary not found at $DOCK_BIN"
    echo "Please run ./build.sh first"
    exit 1
fi

# Detect shell config file
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    SHELL_RC="$HOME/.profile"
fi

# Add dock alias if not already present
if ! grep -q "alias dock=" "$SHELL_RC" 2>/dev/null; then
    echo "" >> "$SHELL_RC"
    echo "# Dock container manager" >> "$SHELL_RC"
    echo "alias dock='$DOCK_BIN'" >> "$SHELL_RC"
    echo "✓ Added 'dock' alias to $SHELL_RC"
else
    echo "✓ 'dock' alias already exists in $SHELL_RC"
fi

echo ""
echo "Setup complete! Run the following to activate:"
echo "  source $SHELL_RC"
echo ""
echo "Then you can use: dock create, dock start, dock list, etc."
