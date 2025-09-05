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
- **Windows** (x86_64)
- **Linux** (Ubuntu 22.04, x86_64) 
- **macOS** (Intel x86_64 and Apple Silicon aarch64)

Releases are created automatically when you push a tag starting with `v` (e.g., `v1.0.2`):
```bash
git tag v1.0.2
git push origin v1.0.2
```

## Notes
Prebuilt binaries are automatically built for Windows, Linux, and macOS using GitHub Actions. You can download them from the [releases page](https://github.com/zachthedev/lofigirl/releases/latest).

The builds are **unsigned**, so you might get a security warning when running them.
## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Disclaimer
I'm not associated in any way with Lofi Girl. Stream illustration by [Machado](https://www.facebook.com/machadoillustrator/). This project provides another way to listen to the stream.
