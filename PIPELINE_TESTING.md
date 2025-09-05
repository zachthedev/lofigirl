# CI/CD Pipeline Testing Guide

This document outlines how to test the new CI/CD pipeline.

## Testing the CI Pipeline

### 1. Conventional Commits Validation
**Test on Pull Request:**
- Create a PR with conventional commit messages (should pass)
- Create a PR with non-conventional messages (should fail)
- Test different commit types: `feat:`, `fix:`, `docs:`, `chore:`, etc.

**Local Testing:**
```bash
# Should pass
echo "feat: Add new feature" | npx commitlint --config ./commitlint.config.js

# Should fail  
echo "bad commit message" | npx commitlint --config ./commitlint.config.js
```

### 2. Code Quality Checks
**Test formatting:**
```bash
cd src-tauri
cargo fmt --check  # Should pass after formatting
```

**Test linting:**
```bash
cd src-tauri  
cargo clippy --all-targets --all-features -- -D warnings
```

## Testing the CD Pipeline

### 1. Manual Release Workflow
1. Go to Actions → "Create Release"
2. Click "Run workflow"  
3. Enter version like `v2.1.1-test`
4. Set as pre-release: `true`
5. Verify it:
   - Updates version in tauri.conf.json and Cargo.toml
   - Creates and pushes the tag
   - Builds for all platforms
   - Creates GitHub release with artifacts

### 2. Tag-based Release Workflow  
```bash
git tag v2.1.2-test
git push origin v2.1.2-test
```
Should automatically trigger builds and create release.

## Expected Artifacts

Each successful release should include:
- **Windows**: `.msi` installer, `.exe` portable
- **macOS**: `.dmg` disk images (Intel + Apple Silicon), `.app.tar.gz` bundles  
- **Linux**: `.deb`, `.rpm`, `.AppImage` packages

## Troubleshooting

### Common Issues:
1. **Permission errors**: Ensure `contents: write` permission in workflows
2. **Build failures**: Check system dependencies match CI environment
3. **Artifact upload issues**: Verify tauri-action version compatibility

### Debug Steps:
1. Check workflow logs in Actions tab
2. Verify tauri.conf.json and Cargo.toml versions match
3. Test build locally with `./test-build.sh`
4. Compare with previous successful runs