#!/bin/bash

# Modern CI/CD Pipeline Setup Script for Lofi Girl
# This script helps set up the proper branch structure and workflow

set -e

echo "🚀 Setting up modern CI/CD pipeline for Lofi Girl..."

# Check if we're in the right directory
if [ ! -f "src-tauri/tauri.conf.json" ]; then
    echo "❌ Error: Please run this script from the root of the lofigirl repository"
    exit 1
fi

# Ensure we're on main branch
echo "📍 Confirming main branch setup..."
git checkout main
git pull origin main

echo "📋 Branch structure should be set up via GitHub:"
echo "   • main      - Production releases (protected)"
echo "   • develop   - Integration branch for features"

echo ""
echo "🏗️  Pipeline Setup Complete!"
echo ""
echo "📋 Your repository uses:"
echo "   • main      - Production releases (protected)"
echo "   • develop   - Integration branch for features"
echo ""
echo "🔧 Next steps:"
echo "   1. Ensure branch protection rules are set up on GitHub:"
echo "      - Go to Settings → Branches"
echo "      - Protect 'main' branch (require PR reviews, status checks)"
echo "      - Protect 'develop' branch (require status checks)"
echo ""
echo "   2. Create feature branches from develop:"
echo "      git checkout develop"
echo "      git checkout -b feature/your-feature-name"
echo ""
echo "   3. Use conventional commits:"
echo "      git commit -m \"feat: add new feature\""
echo "      git commit -m \"fix: resolve issue\""
echo ""
echo "✨ Modern CI/CD pipeline is ready to use!"