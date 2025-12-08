# Creative Gallery - Astro

A modern creative gallery platform built with Astro, featuring a beautiful hero section, media carousel, and responsive design.

## 🚀 Getting Started

### Installation

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Start development server:**
   ```powershell
   npm run dev
   ```

3. **Build for production:**
   ```powershell
   npm run build
   ```

4. **Preview production build:**
   ```powershell
   npm run preview
   ```

## 📋 Git Workflow

This project follows a structured Git workflow with branch management, conventional commits, and semantic versioning.

### Branch Structure

```
main (production)
  └── dev (development)
       └── dev/YYYY-MM-vX (weekly feature branches)
```

### Quick Commands

#### Using the Git Workflow Helper Script

```powershell
npm run git:workflow
```

This interactive script helps you:
- Create new weekly branches
- Make conventional commits
- Push and prepare for PRs
- Update changelog
- Check branch status

#### Manual Commands

**Create a new weekly branch:**
```powershell
git checkout dev
git pull origin dev
git checkout -b dev/2025-12-v1
```

**Make a conventional commit:**
```powershell
git add .
git commit -m "feat(hero): add gradient effect to logo"
```

**Push and create PR:**
```powershell
git push origin dev/2025-12-v1
```

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes

**Examples:**
```bash
feat(carousel): add media carousel with pagination
fix(hero): correct subtitle positioning
docs(readme): update installation instructions
style(hero): adjust logo gradient opacity
```

### Weekly Pull Requests

**Every Friday (end of week):**

1. **Update CHANGELOG.md** following SemVer
2. **Commit all changes** with conventional commits
3. **Push your branch** to remote
4. **Create Pull Request** from `dev/YYYY-MM-vX` to `dev`
5. **Use PR template** (automatically loaded)
6. **Review and merge**

### Changelog Management

Update `CHANGELOG.md` weekly before creating PR:

```powershell
npm run changelog
```

**Semantic Versioning (SemVer):**
- `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

**Example:**
```markdown
## [0.2.0] - 2025-12-14
### Added
- Media carousel with pagination
- Moderniz font integration

### Changed
- Hero logo size increased

### Fixed
- Subtitle positioning
```

## 📁 Project Structure

```
creative-gallery-astro/
├── .github/
│   ├── workflows/
│   │   └── commitlint.yml          # CI for commit linting
│   └── pull_request_template.md    # PR template
├── public/
│   ├── fonts/                       # Custom fonts (Moderniz)
│   └── hero-title.svg              # Hero logo SVG
├── scripts/
│   └── git-workflow.ps1            # Git workflow helper
├── src/
│   └── pages/
│       └── index.astro             # Main page
├── .commitlintrc.json              # Commitlint configuration
├── CHANGELOG.md                     # Project changelog
├── CONTRIBUTING.md                  # Contribution guidelines
└── package.json

```

## 🎨 Features

- **Hero Section**: Modern hero with gradient logo, minimalist subtitle
- **Custom Typography**: Moderniz font integration
- **Media Carousel**: Interactive carousel with video/image placeholders
- **Pagination**: Dot navigation and prev/next buttons
- **Responsive Design**: Mobile-friendly layout
- **Category Pills**: Content filtering options

## 🛠️ Development Workflow

### Daily Development

1. Work on your feature branch (`dev/YYYY-MM-vX`)
2. Make commits using conventional format
3. Test locally with `npm run dev`

### End of Week

1. Update `CHANGELOG.md`
2. Create PR to `dev` branch
3. Review and merge
4. Start new weekly branch for next week

### Monthly/Release

1. Create PR from `dev` to `main`
2. Tag release with version number
3. Deploy to production

## 📚 Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Detailed contribution guidelines
- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes

## 🔗 Useful Links

- [Astro Documentation](https://docs.astro.build)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 📝 Notes

- Always work on feature branches, never directly on `main` or `dev`
- Follow conventional commit format for all commits
- Update CHANGELOG.md weekly before creating PRs
- Use the git workflow helper script for easier management
- Ensure all tests pass before creating PRs

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our workflow, commit conventions, and the process for submitting pull requests.

---

**Current Version:** 0.1.0  
**License:** Private  
**Maintained by:** Telemondo Technologies Development
