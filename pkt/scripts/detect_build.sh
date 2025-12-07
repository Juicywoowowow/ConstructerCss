#!/bin/bash

# Build system detection and dependency resolution
# This script analyzes a project and determines:
# 1. Build system type
# 2. Required dependencies
# 3. Build commands
# 4. Output binary location

# Colors
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
RESET='\033[0m'

# Detect build system and return metadata
detect_build_system() {
    local build_type=""
    local build_cmd=""
    local deps_cmd=""
    local deps_pkg=""
    local output_path=""
    
    # Check for Makefile
    if [ -f "Makefile" ] || [ -f "makefile" ] || [ -f "GNUmakefile" ]; then
        echo -e "${GREEN}[Makefile]${RESET}"
        build_type="makefile"
        
        # Check for install target
        if grep -q "^install:" Makefile 2>/dev/null || grep -q "^install:" makefile 2>/dev/null; then
            build_cmd="make && make PREFIX=\$PKT_HOME install"
        else
            build_cmd="make"
        fi
        
        # Detect dependencies from Makefile
        if grep -q "gcc\|cc" Makefile 2>/dev/null; then
            deps_cmd="gcc"
            deps_pkg="clang"
        fi
        if grep -q "g++" Makefile 2>/dev/null; then
            deps_cmd="$deps_cmd g++"
            deps_pkg="$deps_pkg clang"
        fi
        
        return 0
    fi
    
    # Check for CMakeLists.txt
    if [ -f "CMakeLists.txt" ]; then
        echo -e "${GREEN}[CMake]${RESET}"
        build_type="cmake"
        build_cmd="mkdir -p build && cd build && cmake -DCMAKE_INSTALL_PREFIX=\$PKT_HOME .. && make && make install"
        deps_cmd="cmake make"
        deps_pkg="cmake make clang"
        
        # Check for C++ requirement
        if grep -qi "project.*CXX" CMakeLists.txt; then
            deps_cmd="$deps_cmd g++"
            deps_pkg="$deps_pkg clang"
        fi
        
        return 0
    fi
    
    # Check for configure script
    if [ -f "configure" ]; then
        echo -e "${GREEN}[Autotools (configure)]${RESET}"
        build_type="autotools"
        build_cmd="./configure --prefix=\$PKT_HOME && make && make install"
        deps_cmd="make gcc"
        deps_pkg="make clang"
        
        # Check for C++ requirement
        if grep -q "g++" configure; then
            deps_cmd="$deps_cmd g++"
            deps_pkg="$deps_pkg clang"
        fi
        
        return 0
    fi
    
    # Check for autogen.sh
    if [ -f "autogen.sh" ]; then
        echo -e "${GREEN}[Autotools (autogen)]${RESET}"
        build_type="autogen"
        build_cmd="./autogen.sh && ./configure --prefix=\$PKT_HOME --disable-maintainer-mode && make && make install"
        deps_cmd="autoreconf make gcc"
        deps_pkg="autoconf automake libtool make clang"
        
        return 0
    fi
    
    # Check for Cargo.toml (Rust)
    if [ -f "Cargo.toml" ]; then
        echo -e "${GREEN}[Rust/Cargo]${RESET}"
        build_type="cargo"
        build_cmd="cargo build --release"
        deps_cmd="cargo"
        deps_pkg="rust"
        output_path="target/release"
        
        return 0
    fi
    
    # Check for go.mod (Go)
    if [ -f "go.mod" ]; then
        echo -e "${GREEN}[Go]${RESET}"
        build_type="go"
        build_cmd="go build -o \$PACKAGE"
        deps_cmd="go"
        deps_pkg="golang"
        
        return 0
    fi
    
    # Check for Gradle
    if [ -f "gradlew" ] || [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
        echo -e "${GREEN}[Gradle]${RESET}"
        build_type="gradle"
        
        if [ -f "gradlew" ]; then
            build_cmd="chmod +x gradlew && ./gradlew build --no-daemon"
        else
            build_cmd="gradle build --no-daemon"
        fi
        
        deps_cmd="java"
        deps_pkg="openjdk-17"
        
        if [ ! -f "gradlew" ]; then
            deps_cmd="$deps_cmd gradle"
            deps_pkg="$deps_pkg gradle"
        fi
        
        output_path="build/libs"
        
        return 0
    fi
    
    # Check for Maven (pom.xml)
    if [ -f "pom.xml" ]; then
        echo -e "${GREEN}[Maven]${RESET}"
        build_type="maven"
        build_cmd="mvn clean package"
        deps_cmd="java mvn"
        deps_pkg="openjdk-17 maven"
        output_path="target"
        
        return 0
    fi
    
    # Check for setup.py (Python)
    if [ -f "setup.py" ]; then
        echo -e "${GREEN}[Python/setuptools]${RESET}"
        build_type="python"
        build_cmd="pip install --user ."
        deps_cmd="python pip"
        deps_pkg="python pip"
        
        return 0
    fi
    
    # Check for pyproject.toml (Modern Python)
    if [ -f "pyproject.toml" ]; then
        echo -e "${GREEN}[Python/pyproject]${RESET}"
        build_type="pyproject"
        build_cmd="pip install --user ."
        deps_cmd="python pip"
        deps_pkg="python pip"
        
        return 0
    fi
    
    # Check for package.json (Node.js)
    if [ -f "package.json" ]; then
        echo -e "${GREEN}[Node.js/npm]${RESET}"
        build_type="npm"
        build_cmd="npm install && npm run build"
        deps_cmd="node npm"
        deps_pkg="nodejs npm"
        
        return 0
    fi
    
    # Check for Gemfile (Ruby)
    if [ -f "Gemfile" ]; then
        echo -e "${GREEN}[Ruby/Bundler]${RESET}"
        build_type="ruby"
        build_cmd="bundle install && bundle exec rake build"
        deps_cmd="ruby bundle"
        deps_pkg="ruby"
        
        return 0
    fi
    
    # Check for Meson
    if [ -f "meson.build" ]; then
        echo -e "${GREEN}[Meson]${RESET}"
        build_type="meson"
        build_cmd="meson setup build && meson compile -C build && meson install -C build"
        deps_cmd="meson ninja"
        deps_pkg="meson ninja"
        
        return 0
    fi
    
    # Check for Scons
    if [ -f "SConstruct" ] || [ -f "SConscript" ]; then
        echo -e "${GREEN}[SCons]${RESET}"
        build_type="scons"
        build_cmd="scons"
        deps_cmd="scons"
        deps_pkg="scons"
        
        return 0
    fi
    
    # Check for Bazel
    if [ -f "WORKSPACE" ] || [ -f "BUILD" ]; then
        echo -e "${GREEN}[Bazel]${RESET}"
        build_type="bazel"
        build_cmd="bazel build //:all"
        deps_cmd="bazel"
        deps_pkg="bazel"
        
        return 0
    fi
    
    # No recognized build system
    echo -e "${RED}[Unknown]${RESET}"
    return 1
}

# Analyze project and output JSON metadata
analyze_project() {
    local package_name="$1"
    
    if ! detect_build_system; then
        echo "{\"error\": \"No build system detected\"}"
        return 1
    fi
    
    # Output as JSON for the install script to parse
    cat << EOF
{
  "build_type": "$build_type",
  "build_cmd": "$build_cmd",
  "deps_cmd": "$deps_cmd",
  "deps_pkg": "$deps_pkg",
  "output_path": "$output_path"
}
EOF
}

# If called with argument, analyze that project
if [ -n "$1" ]; then
    cd "$1" 2>/dev/null || exit 1
    analyze_project "$1"
else
    detect_build_system
fi
