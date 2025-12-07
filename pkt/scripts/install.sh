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

# Package definitions - Termux-specific tools
declare -A REPOS
declare -A BUILDS
declare -A BINARIES
declare -A DEPS
declare -A PKG_DEPS

# termux-api - Termux API access
REPOS["termux-api"]="https://github.com/termux/termux-api.git"
BUILDS["termux-api"]="auto"
BINARIES["termux-api"]="termux-api"
DEPS["termux-api"]="make"
PKG_DEPS["termux-api"]="make"

# termux-styling - Terminal styling
REPOS["termux-styling"]="https://github.com/termux/termux-styling.git"
BUILDS["termux-styling"]="auto"
BINARIES["termux-styling"]="termux-styling"
DEPS["termux-styling"]="make"
PKG_DEPS["termux-styling"]="make"

# termux-boot - Run scripts on boot
REPOS["termux-boot"]="https://github.com/termux/termux-boot.git"
BUILDS["termux-boot"]="auto"
BINARIES["termux-boot"]="termux-boot"
DEPS["termux-boot"]="make"
PKG_DEPS["termux-boot"]="make"

# nnn - Terminal file manager (works great on Termux)
REPOS["nnn"]="https://github.com/jarun/nnn.git"
BUILDS["nnn"]="auto"
BINARIES["nnn"]="nnn"
DEPS["nnn"]="make"
PKG_DEPS["nnn"]="make libncurses readline"

# lazygit - Git TUI
REPOS["lazygit"]="https://github.com/jesseduffield/lazygit.git"
BUILDS["lazygit"]="go build -o lazygit && cp lazygit $PKT_BIN/"
BINARIES["lazygit"]="lazygit"
DEPS["lazygit"]="go"
PKG_DEPS["lazygit"]="golang"

# gotop - Terminal system monitor
REPOS["gotop"]="https://github.com/xxxserxxx/gotop.git"
BUILDS["gotop"]="go build -o gotop ./cmd/gotop && cp gotop $PKT_BIN/"
BINARIES["gotop"]="gotop"
DEPS["gotop"]="go"
PKG_DEPS["gotop"]="golang"

# lf - Terminal file manager
REPOS["lf"]="https://github.com/gokcehan/lf.git"
BUILDS["lf"]="go build -o lf && cp lf $PKT_BIN/"
BINARIES["lf"]="lf"
DEPS["lf"]="go"
PKG_DEPS["lf"]="golang"

# croc - File transfer tool
REPOS["croc"]="https://github.com/schollz/croc.git"
BUILDS["croc"]="go build -o croc && cp croc $PKT_BIN/"
BINARIES["croc"]="croc"
DEPS["croc"]="go"
PKG_DEPS["croc"]="golang"

# glow - Markdown renderer
REPOS["glow"]="https://github.com/charmbracelet/glow.git"
BUILDS["glow"]="go build -o glow && cp glow $PKT_BIN/"
BINARIES["glow"]="glow"
DEPS["glow"]="go"
PKG_DEPS["glow"]="golang"

# bat - Cat with syntax highlighting
REPOS["bat"]="https://github.com/sharkdp/bat.git"
BUILDS["bat"]="cargo build --release && cp target/release/bat $PKT_BIN/"
BINARIES["bat"]="bat"
DEPS["bat"]="cargo"
PKG_DEPS["bat"]="rust"

# Auto-detect build system and run
auto_build() {
    echo -e "${CYAN}Auto-detecting build system...${RESET}"
    
    # Use detection script to analyze project
    local detect_script="$PKT_HOME/scripts/detect_build.sh"
    
    if [ ! -f "$detect_script" ]; then
        echo -e "${RED}Detection script not found${RESET}"
        return 1
    fi
    
    # Run detection and parse output
    bash "$detect_script" . > /tmp/pkt_detect.json 2>/dev/null
    
    if [ ! -f /tmp/pkt_detect.json ]; then
        echo -e "${RED}Failed to detect build system${RESET}"
        return 1
    fi
    
    # Extract build info (simple JSON parsing)
    local build_type=$(grep -o '"build_type": "[^"]*' /tmp/pkt_detect.json | cut -d'"' -f4)
    local build_cmd=$(grep -o '"build_cmd": "[^"]*' /tmp/pkt_detect.json | cut -d'"' -f4)
    local deps_cmd=$(grep -o '"deps_cmd": "[^"]*' /tmp/pkt_detect.json | cut -d'"' -f4)
    local deps_pkg=$(grep -o '"deps_pkg": "[^"]*' /tmp/pkt_detect.json | cut -d'"' -f4)
    local output_path=$(grep -o '"output_path": "[^"]*' /tmp/pkt_detect.json | cut -d'"' -f4)
    
    if [ -z "$build_type" ]; then
        echo -e "${RED}No build system detected${RESET}"
        return 1
    fi
    
    echo -e "${GREEN}Detected: $build_type${RESET}"
    
    # Install missing dependencies
    if [ -n "$deps_cmd" ]; then
        echo -e "${CYAN}Checking dependencies...${RESET}"
        
        MISSING_DEPS=()
        for cmd in $deps_cmd; do
            if ! command -v "$cmd" &> /dev/null; then
                MISSING_DEPS+=("$cmd")
            fi
        done
        
        if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
            echo -e "${YELLOW}Missing: ${MISSING_DEPS[*]}${RESET}"
            echo -e "${CYAN}Installing dependencies...${RESET}"
            
            pkg update -y 2>/dev/null || apt update -y 2>/dev/null
            
            for pkg in $deps_pkg; do
                echo -e "${YELLOW}  -> $pkg${RESET}"
                pkg install -y "$pkg" 2>/dev/null || apt install -y "$pkg" 2>/dev/null
            done
            
            echo -e "${GREEN}Dependencies installed${RESET}"
        else
            echo -e "${GREEN}All dependencies satisfied${RESET}"
        fi
    fi
    
    # Execute build command
    echo -e "${CYAN}Building...${RESET}"
    
    # Replace variables in build command
    build_cmd="${build_cmd//\$PKT_HOME/$PKT_HOME}"
    build_cmd="${build_cmd//\$PACKAGE/$PACKAGE}"
    
    eval "$build_cmd"
    local build_result=$?
    
    if [ $build_result -ne 0 ]; then
        echo -e "${RED}Build failed${RESET}"
        return 1
    fi
    
    # Find and copy output
    if [ -n "$output_path" ] && [ -d "$output_path" ]; then
        find_and_copy_binary "$output_path"
    else
        find_and_copy_binary
    fi
    
    return $?
}



# Find binary and copy to bin
find_and_copy_binary() {
    local search_dir="${1:-.}"
    
    # Look for binary with package name
    if [ -f "$search_dir/$PACKAGE" ]; then
        cp "$search_dir/$PACKAGE" "$PKT_BIN/"
        chmod +x "$PKT_BIN/$PACKAGE"
        return 0
    fi
    
    # Look for jar files (Java)
    local jar=$(find "$search_dir" -name "*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" 2>/dev/null | head -1)
    if [ -n "$jar" ]; then
        cp "$jar" "$PKT_BIN/"
        local jar_name=$(basename "$jar")
        
        # Create wrapper script
        cat > "$PKT_BIN/$PACKAGE" << EOF
#!/bin/bash
java -jar "\$HOME/.pkt/bin/$jar_name" "\$@"
EOF
        chmod +x "$PKT_BIN/$PACKAGE"
        echo -e "${GREEN}Created wrapper for $jar_name${RESET}"
        return 0
    fi
    
    # Look for any executable
    local binary=$(find "$search_dir" -maxdepth 2 -type f -executable ! -name "*.sh" ! -name "*.py" ! -name "*.jar" 2>/dev/null | head -1)
    if [ -n "$binary" ]; then
        cp "$binary" "$PKT_BIN/"
        chmod +x "$PKT_BIN/$(basename "$binary")"
        return 0
    fi
    
    return 1
}

if [ -z "$PACKAGE" ]; then
    echo -e "${RED}Error: No package specified${RESET}"
    exit 1
fi

REPO="${REPOS[$PACKAGE]}"
BUILD="${BUILDS[$PACKAGE]}"
DEP_CMDS="${DEPS[$PACKAGE]}"
DEP_PKGS="${PKG_DEPS[$PACKAGE]}"

if [ -z "$REPO" ]; then
    echo -e "${RED}Error: Unknown package '$PACKAGE'${RESET}"
    exit 1
fi

# Install dependencies first
echo -e "${CYAN}Checking dependencies for $PACKAGE...${RESET}"

MISSING_DEPS=()
for cmd in $DEP_CMDS; do
    if ! command -v "$cmd" &> /dev/null; then
        MISSING_DEPS+=("$cmd")
    fi
done

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${YELLOW}Missing: ${MISSING_DEPS[*]}${RESET}"
    echo -e "${CYAN}Installing build dependencies...${RESET}"
    
    pkg update -y 2>/dev/null || apt update -y 2>/dev/null
    
    for pkg in $DEP_PKGS; do
        echo -e "${YELLOW}  -> $pkg${RESET}"
        pkg install -y "$pkg" 2>/dev/null || apt install -y "$pkg" 2>/dev/null
    done
    
    echo -e "${GREEN}Dependencies installed${RESET}"
else
    echo -e "${GREEN}All dependencies satisfied${RESET}"
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
    git clone --depth 1 "$REPO" "$PACKAGE"
    cd "$PACKAGE"
fi

# Build
echo -e "${CYAN}Building $PACKAGE...${RESET}"

if [ "$BUILD" == "auto" ]; then
    auto_build
    BUILD_RESULT=$?
else
    eval "$BUILD"
    BUILD_RESULT=$?
fi

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}Successfully installed $PACKAGE${RESET}"
    
    if [ ! -f "$PKT_INSTALLED" ]; then
        echo '{"installed":[]}' > "$PKT_INSTALLED"
    fi
    
    if ! grep -q "\"$PACKAGE\"" "$PKT_INSTALLED"; then
        sed -i "s/\[/[\"$PACKAGE\",/" "$PKT_INSTALLED"
        sed -i 's/,]/]/' "$PKT_INSTALLED"
    fi
    
    exit 0
else
    echo -e "${RED}Build failed for $PACKAGE${RESET}"
    exit 1
fi
