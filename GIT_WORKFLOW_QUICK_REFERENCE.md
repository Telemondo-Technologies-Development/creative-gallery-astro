# Git Workflow Quick Reference

## 🚀 Quick Start

### Option 1: Use Helper Script (Recommended)
```powershell
npm run git:workflow
```

### Option 2: Manual Commands

## 📅 Weekly Workflow

### Monday - Start New Week

```powershell
# Switch to dev and update
git checkout dev
git pull origin dev

# Create new weekly branch
git checkout -b dev/2025-12-v1
```

### During the Week - Daily Work

```powershell
# Check status
git status

# Stage changes
git add .

# Commit with conventional format
git commit -m "feat(hero): add new feature"

# Push to remote
git push origin dev/2025-12-v1
```

### Friday - End of Week PR

```powershell
# 1. Update CHANGELOG.md
npm run changelog

# 2. Commit changelog
git add CHANGELOG.md
git commit -m "docs(changelog): update for v0.2.0"

# 3. Push final changes
git push origin dev/2025-12-v1

# 4. Create PR on GitHub/GitLab
# - From: dev/2025-12-v1
# - To: dev
# - Use PR template
```

## 📝 Conventional Commit Cheat Sheet

### Format
```
<type>(<scope>): <subject>
```

### Common Types
| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(carousel): add pagination` |
| `fix` | Bug fix | `fix(hero): correct alignment` |
| `docs` | Documentation | `docs(readme): update setup` |
| `style` | Formatting | `style(hero): adjust spacing` |
| `refactor` | Code restructure | `refactor(carousel): simplify logic` |
| `perf` | Performance | `perf(images): optimize loading` |
| `test` | Tests | `test(carousel): add unit tests` |
| `build` | Build changes | `build(deps): update astro` |
| `chore` | Maintenance | `chore(config): update settings` |

### Examples

```bash
# Feature
git commit -m "feat(hero): add gradient effect to logo"

# Bug fix
git commit -m "fix(carousel): resolve pagination issue"

# Documentation
git commit -m "docs(contributing): add workflow guide"

# Style
git commit -m "style(navbar): improve responsive layout"

# Multiple scopes
git commit -m "feat(hero,carousel): add animations"

# Breaking change
git commit -m "feat(api)!: change endpoint structure

BREAKING CHANGE: API endpoints now use v2 format"
```

## 🏷️ Semantic Versioning

### Version Format: MAJOR.MINOR.PATCH

| Version | When | Example |
|---------|------|---------|
| **MAJOR** (1.0.0) | Breaking changes | API changes, removed features |
| **MINOR** (0.1.0) | New features | New carousel, new page |
| **PATCH** (0.0.1) | Bug fixes | Fix alignment, fix typo |

### Examples

```
0.1.0 → 0.2.0  (added carousel feature)
0.2.0 → 0.2.1  (fixed carousel bug)
0.2.1 → 1.0.0  (breaking API change)
```

## 📋 CHANGELOG.md Template

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
- Subtitle positioning in white background

## [0.1.0] - 2025-12-08
### Added
- Initial project setup
- Hero section
- Navbar
```

## 🔄 Branch Management

### Branch Naming

```
main                    # Production
dev                     # Development
dev/2025-12-v1         # Week 1 of December 2025
dev/2025-12-v2         # Week 2 of December 2025
dev/2026-01-v1         # Week 1 of January 2026
```

### Common Commands

```powershell
# List all branches
git branch -a

# Switch branch
git checkout dev

# Create and switch
git checkout -b dev/2025-12-v1

# Delete local branch
git branch -d dev/2025-12-v1

# Delete remote branch
git push origin --delete dev/2025-12-v1

# Update from remote
git pull origin dev
```

## 📤 Pull Request Checklist

- [ ] All changes committed with conventional format
- [ ] CHANGELOG.md updated with version and date
- [ ] Version follows SemVer (MAJOR.MINOR.PATCH)
- [ ] Tested locally (`npm run dev`)
- [ ] No console errors
- [ ] PR title describes the week
- [ ] PR description filled using template
- [ ] Ready for review

## 🛠️ Useful Commands

```powershell
# View commit history
git log --oneline -10

# View changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote URLs
git remote -v

# Check current branch
git branch --show-current

# Stash changes
git stash
git stash pop

# View file changes
git status -s
```

## 🚨 Emergency Fixes

### Wrong commit message
```powershell
# If not pushed yet
git commit --amend -m "correct message"

# If already pushed (avoid if possible)
git commit --amend -m "correct message"
git push --force-with-lease
```

### Committed to wrong branch
```powershell
# Move last commit to new branch
git branch dev/2025-12-v2
git reset --hard HEAD~1
git checkout dev/2025-12-v2
```

### Need to update PR
```powershell
# Make changes
git add .
git commit -m "fix(pr): address review comments"
git push origin dev/2025-12-v1
# PR automatically updates
```

## 📞 Quick Help

| Need | Command |
|------|---------|
| Start week | `git checkout dev && git pull && git checkout -b dev/YYYY-MM-vX` |
| Commit | `git add . && git commit -m "type(scope): message"` |
| Update changelog | `npm run changelog` |
| Push | `git push origin dev/YYYY-MM-vX` |
| Helper script | `npm run git:workflow` |

## 🎯 Weekly Checklist

### Monday
- [ ] Create new weekly branch from dev
- [ ] Plan week's features

### Daily
- [ ] Make commits with conventional format
- [ ] Push changes regularly
- [ ] Test locally

### Friday
- [ ] Update CHANGELOG.md
- [ ] Commit all changes
- [ ] Push to remote
- [ ] Create PR to dev
- [ ] Review and merge

---

**Remember:**
- Never commit directly to `main` or `dev`
- Always use conventional commit format
- Update CHANGELOG.md weekly
- Create PR every Friday
- Follow SemVer for versions
