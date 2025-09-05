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

# Function to create and push branch if it doesn't exist
create_branch_if_needed() {
    local branch_name=$1
    local description=$2
    
    if git show-ref --verify --quiet refs/heads/$branch_name; then
        echo "✅ Branch '$branch_name' already exists"
    else
        echo "🌟 Creating '$branch_name' branch - $description"
        git checkout -b $branch_name
        git push -u origin $branch_name
        git checkout main
    fi
}

# Ensure we're on main branch
echo "📍 Switching to main branch..."
git checkout main
git pull origin main

# Create develop branch if it doesn't exist
create_branch_if_needed "develop" "Integration branch for combining features"

echo ""
echo "🏗️  Branch Structure Setup Complete!"
echo ""
echo "📋 Your repository now has:"
echo "   • main      - Production releases (protected)"
echo "   • develop   - Integration branch for features"
echo ""
echo "🔧 Next steps:"
echo "   1. Set up branch protection rules on GitHub:"
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