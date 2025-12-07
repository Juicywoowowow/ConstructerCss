#!/bin/bash
set -e

echo "Building Dock..."
cargo build --release

echo "✓ Build complete!"
echo "Binary location: ./target/release/dock"
echo ""
echo "Usage:"
echo "  ./target/release/dock create <name> <script>"
echo "  ./target/release/dock start <name> [--port host:container]"
echo "  ./target/release/dock stop <name>"
echo "  ./target/release/dock list"
echo "  ./target/release/dock enter <name>"
echo "  ./target/release/dock logs <name>"
echo "  ./target/release/dock remove <name>"
