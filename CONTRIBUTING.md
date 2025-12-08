# Contributing Guide

## Branch Management Strategy

### Branch Structure

We follow a structured branching strategy:

```
main (production-ready code)
  └── dev (development branch)
       └── dev/YYYY-MM-vX (weekly feature branches)
```

### Branch Naming Convention

- **main**: Production-ready code, stable releases only
- **dev**: Main development branch, integration of features
- **dev/YYYY-MM-vX**: Weekly feature branches
  - Format: `dev/2025-12-v1`, `dev/2025-12-v2`, etc.
  - YYYY-MM: Year and month
  - vX: Version number for that month (v1, v2, v3...)

### Workflow

1. **Create a weekly feature branch from dev:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b dev/2025-12-v1
   ```

2. **Work on your features during the week**

3. **End of week: Create Pull Request**
   - PR from `dev/YYYY-MM-vX` → `dev`
   - Review and merge
   - Update CHANGELOG.md

4. **Monthly or when ready: Merge to main**
   - PR from `dev` → `main`
   - Tag with version number

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# Feature
git commit -m "feat(carousel): add media carousel with pagination"

# Bug fix
git commit -m "fix(hero): correct subtitle positioning in white area"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style changes
git commit -m "style(hero): adjust logo gradient opacity effect"

# Refactor
git commit -m "refactor(carousel): simplify navigation logic"

# Multiple lines
git commit -m "feat(hero): add Moderniz font integration

- Download and integrate Moderniz font
- Update SVG to use custom font
- Add font-face declarations"
```

### Scope Examples

- `hero`: Hero section
- `carousel`: Media carousel
- `navbar`: Navigation bar
- `footer`: Footer section
- `config`: Configuration files
- `deps`: Dependencies

## Pull Request Process

### Weekly PR (End of Week)

1. **Ensure all changes are committed**
   ```bash
   git status
   git add .
   git commit -m "feat: weekly feature summary"
   ```

2. **Push your branch**
   ```bash
   git push origin dev/2025-12-v1
   ```

3. **Create PR on GitHub/GitLab**
   - Base: `dev`
   - Compare: `dev/2025-12-v1`
   - Title: `Week of Dec 8-14, 2025 - v1 Features`
   - Description: List all features and changes

4. **PR Template**
   ```markdown
   ## Week Summary
   Week of: [Date Range]
   Branch: dev/YYYY-MM-vX

   ## Changes
   - [ ] Feature 1
   - [ ] Feature 2
   - [ ] Bug fixes

   ## Changelog Updated
   - [x] CHANGELOG.md updated with all changes

   ## Testing
   - [x] Tested locally
   - [x] No breaking changes

   ## Screenshots
   [Add screenshots if applicable]
   ```

5. **Review and Merge**
   - Get review (if team)
   - Merge to `dev`
   - Delete feature branch

## Changelog Management

### Update CHANGELOG.md Weekly

Every week, before creating your PR, update `CHANGELOG.md`:

1. **Move items from [Unreleased] to a new version section**
2. **Follow SemVer pattern**
3. **Add date**

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.1.0): New features, backwards-compatible
- **PATCH** (0.0.1): Bug fixes, backwards-compatible

### Changelog Structure

```markdown
## [Unreleased]
(Work in progress for next release)

## [0.2.0] - 2025-12-14
### Added
- New features

### Changed
- Modifications to existing features

### Deprecated
- Features to be removed

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security fixes

## [0.1.0] - 2025-12-08
Initial release
```

### Example Weekly Update

**Before PR (Friday):**
```markdown
## [Unreleased]

## [0.2.0] - 2025-12-14
### Added
- Media carousel with video/image placeholders
- Carousel navigation with pagination
- Moderniz font integration

### Changed
- Hero logo size increased to 1500px
- Subtitle styling made minimalist

### Fixed
- Subtitle positioning in white background area
```

## Quick Command Reference

```bash
# Start new weekly branch
git checkout dev
git pull origin dev
git checkout -b dev/2025-12-v1

# Make changes and commit (conventional)
git add .
git commit -m "feat(hero): add gradient effect to logo"

# Push and create PR
git push origin dev/2025-12-v1

# After PR merged, update local dev
git checkout dev
git pull origin dev

# Create next week's branch
git checkout -b dev/2025-12-v2
```

## Git Hooks (Optional)

Install commitlint for automatic commit message validation:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npm install --save-dev husky
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```
