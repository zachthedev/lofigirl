<p align="center">
<img src="https://repository-images.githubusercontent.com/658017980/ae660816-9106-4d50-8149-752add67a3cc" alt="Screenshot of the Lofi player">
</p>
<p align="center">
  Lofi Girl embedded in a lightweight Tauri application.
</p>

## Usage
Download the [latest release](https://github.com/zachthedev/lofigirl/releases/latest) and run it.

## Automated Releases

This project automatically builds for multiple platforms when new versions are tagged:
- **Windows** (x86_64) - `.msi` installer and `.exe` portable 
- **Linux** (Ubuntu 22.04, x86_64) - `.deb`, `.rpm`, and `.AppImage` packages
- **macOS** (Intel x86_64 and Apple Silicon aarch64) - `.dmg` and `.app.tar.gz`

### Creating a New Release

#### Option 1: Using GitHub Actions (Recommended)
1. Go to the **Actions** tab in GitHub
2. Select **"Create Release"** workflow
3. Click **"Run workflow"**
4. Enter version in format `v1.0.3` 
5. Choose whether it's a pre-release
6. Click **"Run workflow"**

This will automatically:
- Update version numbers in configuration files
- Create and push the git tag
- Build for all platforms 
- Create a GitHub release with all artifacts

#### Option 2: Manual Tagging
If you prefer manual control:

```bash
git tag v1.0.2
git push origin v1.0.2
```

This triggers the build workflow to create a release draft with all platform artifacts.

### Expected Release Artifacts

Each release should include these files:
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
