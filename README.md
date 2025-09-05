<p align="center">
TODO IMAGE
<img src="" alt="Screenshot of the Lofi player">
</p>
<p align="center">
  Lofi Girl embedded in a lightweight Tauri application.
</p>

## Usage
Download the [latest release](https://github.com/zachthedev/lofigirl/releases/latest) and run it.

## Development

### Prerequisites
- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/) (for conventional commits)
- System dependencies for your platform (see [Tauri prerequisites](https://tauri.app/v2/guides/getting-started/prerequisites/))

### Setup
```bash
# Clone the repository
git clone https://github.com/zachthedev/lofigirl.git
cd lofigirl

# Install Node.js dependencies (for conventional commits)
npm install

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev libgtk-3-dev libglib2.0-dev \
  libayatana-appindicator3-dev librsvg2-dev patchelf build-essential \
  curl wget file libssl-dev libxdo-dev pkg-config

# Build the application
cd src-tauri
cargo tauri build
```

### Contributing
This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**
- `feat: Add audio-only mode`
- `fix: Resolve window dragging issue`
- `docs: Update installation instructions`
- `chore: Update dependencies`

The commit message will be automatically validated when you commit.

## Automated Releases

This project uses a robust CI/CD pipeline with multiple release strategies:

### CI Pipeline (Continuous Integration)
- **Runs on**: Every PR and push to main
- **Features**: 
  - Code linting and formatting checks
  - Conventional commits validation
  - Fast compilation tests
  - Rust clippy analysis

### Release Strategies

#### Option 1: Manual Release Creation (Recommended)
1. Go to the **Actions** tab in GitHub
2. Select **"Release"** workflow  
3. Click **"Run workflow"**
4. Enter version in format `v2.1.0`
5. Choose whether it's a pre-release
6. Click **"Run workflow"**

This will automatically:
- Update version numbers in configuration files
- Create and push the git tag
- Build for all platforms simultaneously
- Create a GitHub release with all artifacts

#### Option 2: Tag-based Release (Automatic)
Simply push a version tag:
```bash
git tag v2.1.0
git push origin v2.1.0
```

This triggers the same unified release workflow automatically.

### Expected Release Artifacts

Each release includes optimized builds for multiple platforms:
- `lofi-girl_VERSION_amd64.deb` - Debian/Ubuntu package
- `lofi-girl-VERSION-1.x86_64.rpm` - RedHat/Fedora package  
- `lofi-girl_VERSION_amd64.AppImage` - Linux portable app
- `lofi-girl_VERSION_x64-setup.msi` - Windows installer
- `lofi-girl_VERSION_x64_en-US.msi` - Windows installer (alternative)
- `lofi-girl.exe` - Windows portable executable
- `lofi-girl_VERSION_aarch64.dmg` - macOS Apple Silicon
- `lofi-girl_VERSION_x64.dmg` - macOS Intel
- `lofi-girl_aarch64.app.tar.gz` - macOS Apple Silicon app bundle
- `lofi-girl_x64.app.tar.gz` - macOS Intel app bundle

## Notes
Prebuilt binaries are automatically built for Windows, Linux, and macOS using GitHub Actions. You can download them from the [releases page](https://github.com/zachthedev/lofigirl/releases/latest).

The builds are **unsigned**, so you might get a security warning when running them.
## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Disclaimer
I'm not associated in any way with Lofi Girl. Stream illustration by [Machado](https://www.facebook.com/machadoillustrator/). This project provides another way to listen to the stream.
