# GitHub Rulesets Setup Guide

This guide provides step-by-step instructions for setting up GitHub Rulesets (the modern replacement for Branch Protection Rules) for the Lofi Girl repository.

## Overview

GitHub Rulesets provide more granular and flexible control over repository rules. Unlike the old Branch Protection Rules, Rulesets can:
- Apply to multiple branches with patterns
- Combine different rule types in a single ruleset
- Provide better conflict resolution
- Offer more detailed enforcement options

## Required Rulesets

### 1. Main Branch Protection Ruleset

**Purpose**: Protect the main branch and ensure all PRs are properly validated before release.

#### Setup Steps:

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Rules** → **Rulesets**
3. Click **New ruleset**
4. Configure the following:

**General Settings:**
- **Ruleset Name**: `Main Branch Protection`
- **Enforcement status**: `Active`
- **Target branches**: 
  - ☑️ Add target
  - Select `Include by name`
  - Enter: `main`

**Branch Protection Rules:**
- ☑️ **Require a pull request before merging**
  - Required approving reviews: `1`
  - ☑️ Dismiss stale pull request approvals when new commits are pushed
  - ☑️ Require review from code owners (if you have CODEOWNERS file)
- ☑️ **Require status checks to pass**
  - ☑️ Require branches to be up to date before merging
  - **Required status checks** (add each one):
    ```
    changes
    lint
    test
    build
    build-cross-platform (ubuntu-latest)
    build-cross-platform (windows-latest)
    build-cross-platform (macos-latest)
    validate-commits
    ```
- ☑️ **Require signed commits**
- ☑️ **Require linear history**
- ☑️ **Restrict pushes that create files larger than 100MB**

**Push Protection:**
- ☑️ **Restrict creations** (prevents direct commits to main)
- ☑️ **Restrict deletions** (prevents branch deletion)
- ☑️ **Restrict force pushes**

### 2. Develop Branch Protection Ruleset

**Purpose**: Ensure feature branches are properly validated before merging to develop.

#### Setup Steps:

1. In **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset**
3. Configure the following:

**General Settings:**
- **Ruleset Name**: `Develop Branch Protection`
- **Enforcement status**: `Active`
- **Target branches**:
  - ☑️ Add target
  - Select `Include by name`
  - Enter: `develop`

**Branch Protection Rules:**
- ☑️ **Require a pull request before merging**
  - Required approving reviews: `1`
  - ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ **Require status checks to pass**
  - ☑️ Require branches to be up to date before merging
  - **Required status checks**:
    ```
    changes
    lint
    test
    build
    validate-commits
    ```
- ☑️ **Require linear history**

**Push Protection:**
- ☑️ **Restrict force pushes**

### 3. Feature Branch Ruleset

**Purpose**: Apply basic validation to all feature branches.

#### Setup Steps:

1. In **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset**
3. Configure the following:

**General Settings:**
- **Ruleset Name**: `Feature Branch Standards`
- **Enforcement status**: `Active`
- **Target branches**:
  - ☑️ Add target
  - Select `Include by name pattern`
  - Enter: `feature/**`

**Branch Protection Rules:**
- ☑️ **Require status checks to pass** (for PRs to develop)
  - **Required status checks**:
    ```
    changes
    lint
    test
    validate-commits
    ```

### 4. Release Protection Ruleset

**Purpose**: Protect release-related branches and tags.

#### Setup Steps:

1. In **Settings** → **Rules** → **Rulesets**
2. Click **New ruleset**
3. Configure the following:

**General Settings:**
- **Ruleset Name**: `Release Protection`
- **Enforcement status**: `Active`
- **Target branches**:
  - ☑️ Add target
  - Select `Include by name pattern`
  - Enter: `release/**`
- **Target tags**:
  - ☑️ Add target
  - Select `Include by name pattern`
  - Enter: `v*`

**Tag Protection:**
- ☑️ **Restrict creations** (only allow through releases)
- ☑️ **Restrict deletions**
- ☑️ **Restrict updates**

## Branch Hierarchy Setup

After creating the rulesets, set up the branch hierarchy:

### 1. Create Core Branches

The develop and example feature branches have been created locally. You'll need to push them:

```bash
# Push develop branch
git checkout develop
git push -u origin develop

# Set develop as default branch (optional, in GitHub Settings → General)
```

### 2. Configure Default Branch (Optional)

In **Settings** → **General** → **Default branch**:
- Consider keeping `main` as default for releases
- Or change to `develop` if you prefer feature branches to start from develop by default

### 3. Create Branch Protection Summary

After setup, your branches will have:

**main**:
- ✅ Requires PR with 1 approval
- ✅ Requires all status checks (full CI + cross-platform)
- ✅ Requires signed commits
- ✅ Requires linear history
- ✅ Blocks direct pushes/force pushes
- ✅ Blocks large files (>100MB)

**develop**:
- ✅ Requires PR with 1 approval  
- ✅ Requires core status checks (CI only)
- ✅ Requires linear history
- ✅ Blocks force pushes

**feature/***:
- ✅ Requires status checks for PRs to develop
- ✅ Standard validation requirements

**v* tags**:
- ✅ Protected from manual creation/deletion
- ✅ Only created through release workflows

## Validation

To verify your rulesets are working:

1. Try to push directly to main (should be blocked)
2. Create a PR without status checks (should be blocked from merging)
3. Create a feature branch and ensure it can merge to develop
4. Ensure develop → main PRs require full cross-platform builds

## Migration from Branch Protection Rules

If you had old Branch Protection Rules:

1. Go to **Settings** → **Branches**
2. Delete any existing protection rules for `main` and `develop`
3. The new Rulesets will take precedence and provide better functionality

## Troubleshooting

**Ruleset not applying?**
- Ensure ruleset is set to `Active`
- Check that branch name patterns are correct
- Verify you have admin permissions on the repository

**Status checks not working?**
- Ensure the status check names match exactly what the CI workflows report
- Check that workflows are running on the correct events (pull_request, push, etc.)

**Can't merge PRs?**
- Verify all required status checks have passed
- Ensure the branch is up to date with the target branch
- Check that you have sufficient permissions

## Benefits of This Setup

✅ **Modern GitHub Features**: Uses latest Rulesets instead of deprecated Branch Protection  
✅ **Granular Control**: Different rules for different branch types  
✅ **Release Safety**: Protected tags prevent accidental releases  
✅ **Developer Experience**: Clear requirements for each branch type  
✅ **CI/CD Integration**: Perfectly aligned with the modern pipeline architecture  

This setup ensures your repository follows 2025 best practices for branch management and release safety.