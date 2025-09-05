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

## Branch Strategy & Release Process

This project uses a modern branch-based workflow designed for reliable releases:

### Branch Structure
- **`main`** - Production releases only. Protected branch that contains stable, tested code
- **`develop`** - Integration branch for combining features before release  
- **`feature/*`** - Individual feature branches that merge into `develop`

### Development Workflow

1. **Create feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop  
   git checkout -b feature/your-feature-name
   ```

2. **Develop and commit** using [conventional commits](https://www.conventionalcommits.org/):
   ```bash
   git add .
   git commit -m "feat: add new functionality"
   ```

3. **Create PR** to `develop` branch - CI validates all commits and runs full test suite

4. **Merge to develop** - Multiple features can be combined here for testing

5. **Release from develop** - When ready, create PR from `develop` to `main` to trigger release

### Release Strategies

#### 🚀 Automated Release (Recommended)
When `develop` is merged to `main`, releases trigger automatically based on conventional commits:
- `feat:` → minor version bump (2.0.0 → 2.1.0)  
- `fix:` → patch version bump (2.0.0 → 2.0.1)
- `feat!:` or `BREAKING CHANGE:` → major version bump (2.0.0 → 3.0.0)

#### ⚡ Manual Release
For immediate releases or version overrides:
```bash
gh workflow run release.yml -f version=v2.1.0 -f prerelease=false
```

#### 🧪 Development Releases  
Pushes to `develop` create automatic pre-releases for testing:
- Tagged as `v2.1.0-dev.abc1234`
- Marked as pre-release
- Perfect for testing before main release

### CI/CD Pipeline Architecture

The modern pipeline is designed for efficiency and artifact reuse:

**Key Features:**
- **Path-based filtering** - Only runs relevant jobs when code changes
- **Artifact reuse** - Release pipeline reuses CI build artifacts when possible
- **Smart caching** - Rust and Node.js dependencies cached across jobs
- **Conventional commits** - Automatic changelog generation and semantic versioning

### Expected Release Artifacts

Each release includes optimized builds for all platforms:
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

## Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)
- [Rust](https://rustup.rs/) (latest stable)
- Platform-specific dependencies (automatically installed in CI)

### Quick Start
```bash
# Clone and setup
git clone https://github.com/zachthedev/lofigirl.git
cd lofigirl
npm install

# Run in development mode  
cd src-tauri
cargo tauri dev

# Build for production
cargo tauri build
```

### Code Quality
The project enforces quality standards through:
- **Conventional Commits** - Validated on all PRs
- **Rust formatting** - `cargo fmt` required
- **Linting** - `cargo clippy` with strict warnings
- **Testing** - Unit tests run on all changes

## Notes
Prebuilt binaries are automatically built for Windows, Linux, and macOS using GitHub Actions. Download the latest stable release from the [releases page](https://github.com/zachthedev/lofigirl/releases/latest), or try development builds from the [pre-releases](https://github.com/zachthedev/lofigirl/releases).

The builds are **unsigned**, so you might get a security warning when running them.
## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Disclaimer
I'm not associated in any way with Lofi Girl. Stream illustration by [Machado](https://www.facebook.com/machadoillustrator/). This project provides another way to listen to the stream.
