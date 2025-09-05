# Feature Branch Example

This is a placeholder file to establish the `feature/` branch structure.

## Usage

Feature branches should be created from the `develop` branch:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## Naming Convention

Use descriptive names for feature branches:
- `feature/add-dark-mode`
- `feature/fix-audio-controls` 
- `feature/improve-performance`

## Workflow

1. Create feature branch from `develop`
2. Make your changes with conventional commits
3. Push and create PR to `develop` 
4. After review and CI passes, merge to `develop`
5. Delete feature branch after merge

This file can be deleted once actual feature development begins.