#!/bin/bash
# Script to test the Tauri build process locally

set -e

echo "🔨 Testing Tauri build process..."

# Check if required tools are installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo is not installed. Please install Rust: https://rustup.rs/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js: https://nodejs.org/"
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies for Ubuntu (if on Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 Installing system dependencies for Linux..."
    sudo apt-get update
    sudo apt-get install -y \
        libwebkit2gtk-4.1-dev \
        libgtk-3-dev \
        libglib2.0-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev \
        patchelf \
        build-essential \
        curl \
        wget \
        file \
        libssl-dev \
        libxdo-dev \
        pkg-config
fi

echo "🦀 Building Tauri application..."
cd src-tauri

# Install Tauri CLI if not present
if ! command -v cargo tauri &> /dev/null; then
    echo "📦 Installing Tauri CLI..."
    cargo install tauri-cli
fi

# Build the application
echo "🏗️  Building application (this may take a while)..."
cargo tauri build

echo "✅ Build completed!"
echo "📦 Artifacts should be in src-tauri/target/release/bundle/"

# List the generated artifacts
if [ -d "target/release/bundle" ]; then
    echo ""
    echo "Generated artifacts:"
    find target/release/bundle -type f -name "*lofi-girl*" -o -name "*.msi" -o -name "*.exe" -o -name "*.deb" -o -name "*.rpm" -o -name "*.AppImage" -o -name "*.dmg" -o -name "*.app.tar.gz" | sort
fi