# Expected Release Artifacts

Based on Tauri's bundler configuration with `"targets": "all"`, each platform should generate:

## Windows (windows-latest)
- `lofi-girl.exe` - Portable executable
- `lofi-girl_2.0.0_x64-setup.msi` - MSI installer
- `lofi-girl_2.0.0_x64_en-US.msi` - MSI installer (localized)

## macOS (macos-latest with aarch64-apple-darwin)
- `lofi-girl_2.0.0_aarch64.dmg` - DMG installer for Apple Silicon
- `lofi-girl_aarch64.app.tar.gz` - App bundle for Apple Silicon

## macOS (macos-latest with x86_64-apple-darwin) 
- `lofi-girl_2.0.0_x64.dmg` - DMG installer for Intel
- `lofi-girl_x64.app.tar.gz` - App bundle for Intel

## Linux (ubuntu-22.04)
- `lofi-girl_2.0.0_amd64.deb` - Debian/Ubuntu package
- `lofi-girl-2.0.0-1.x86_64.rpm` - RedHat/Fedora package
- `lofi-girl_2.0.0_amd64.AppImage` - Portable Linux application

## Total Expected: 10 artifacts

The user reported only getting 5 artifacts:
- ✅ lofi-girl-2.0.0-1.x86_64.rpm (Linux RPM)
- ✅ lofi-girl_2.0.0_aarch64.dmg (macOS ARM)
- ✅ lofi-girl_2.0.0_amd64.AppImage (Linux AppImage)  
- ✅ lofi-girl_2.0.0_amd64.deb (Linux DEB)
- ✅ lofi-girl_aarch64.app.tar.gz (macOS ARM app)

**Missing artifacts:**
- ❌ Windows .exe and .msi files (likely Windows job failed)
- ❌ macOS Intel .dmg and .app.tar.gz (likely Intel macOS job failed)

This suggests that 2 of the 4 platform builds failed, which explains why only 5 artifacts were generated instead of 10.