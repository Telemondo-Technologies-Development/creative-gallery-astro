# Git Workflow Diagram

## Branch Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         MAIN BRANCH                          │
│                    (Production Ready)                        │
│                                                              │
│  Tags: v0.1.0, v0.2.0, v1.0.0                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Monthly PR / Release
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                         DEV BRANCH                           │
│                   (Integration Branch)                       │
│                                                              │
│  Merges from weekly feature branches                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Weekly PR (Every Friday)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ dev/2025-12-v1│  │ dev/2025-12-v2│  │ dev/2025-12-v3│
│               │  │               │  │               │
│ Week 1        │  │ Week 2        │  │ Week 3        │
│ Dec 1-7       │  │ Dec 8-14      │  │ Dec 15-21     │
└───────────────┘  └───────────────┘  └───────────────┘
```

## Weekly Workflow Cycle

```
MONDAY                    TUESDAY-THURSDAY              FRIDAY
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│             │          │             │          │             │
│  Create     │          │  Develop    │          │  Create PR  │
│  Branch     │──────────▶  Features   │──────────▶  & Merge    │
│             │          │             │          │             │
│ dev/YYYY-   │          │ Commit with │          │ Update      │
│ MM-vX       │          │ Conventional│          │ CHANGELOG   │
│             │          │ Format      │          │             │
└─────────────┘          └─────────────┘          └─────────────┘
      │                                                   │
      │                                                   │
      └───────────────────────────────────────────────────┘
                    Start Next Week's Branch
```

## Commit Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Working Directory                      │
│                                                           │
│  Modified files: index.astro, package.json, etc.         │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ git add .
                         ▼
┌──────────────────────────────────────────────────────────┐
│                     Staging Area                          │
│                                                           │
│  Staged files ready for commit                           │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ git commit -m "type(scope): message"
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    Local Repository                       │
│                                                           │
│  Commits with conventional format                        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ git push origin dev/YYYY-MM-vX
                         ▼
┌──────────────────────────────────────────────────────────┐
│                   Remote Repository                       │
│                                                           │
│  GitHub/GitLab - Ready for PR                            │
└──────────────────────────────────────────────────────────┘
```

## Conventional Commit Types Flow

```
                    ┌─────────────────┐
                    │  Code Changes   │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌──────────────┐
        │  New Feature? │         │  Bug Fix?    │
        └───────┬───────┘         └──────┬───────┘
                │                        │
                ▼                        ▼
          feat(scope)              fix(scope)
                │                        │
                └────────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌─────────────┐
        │  Docs Only?  │          │  Styling?   │
        └──────┬───────┘          └──────┬──────┘
               │                         │
               ▼                         ▼
         docs(scope)               style(scope)
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Commit Made  │
                    └───────────────┘
```

## Pull Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FRIDAY - END OF WEEK                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Update CHANGELOG │
                    │   (SemVer)       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Commit Changes   │
                    │ (Conventional)   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Push to Remote   │
                    └────────┬─────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │         Create Pull Request            │
        │                                        │
        │  From: dev/2025-12-v1                 │
        │  To:   dev                            │
        │                                        │
        │  Use PR Template                      │
        └────────────────┬───────────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  Code Review   │
                │  (Optional)    │
                └────────┬───────┘
                         │
                         ▼
                ┌────────────────┐
                │  Merge to Dev  │
                └────────┬───────┘
                         │
                         ▼
                ┌────────────────┐
                │ Delete Feature │
                │    Branch      │
                └────────┬───────┘
                         │
                         ▼
                ┌────────────────┐
                │  Start Next    │
                │  Week's Branch │
                └────────────────┘
```

## Version Numbering Flow

```
                    ┌──────────────┐
                    │  0.1.0       │
                    │  (Initial)   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  PATCH   │   │  MINOR   │   │  MAJOR   │
    │          │   │          │   │          │
    │ Bug Fix  │   │ Feature  │   │ Breaking │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  0.1.1   │   │  0.2.0   │   │  1.0.0   │
    └──────────┘   └──────────┘   └──────────┘
```

## File Structure Flow

```
creative-gallery-astro/
│
├── .github/
│   ├── workflows/
│   │   └── commitlint.yml ──────────▶ CI: Validates commits
│   ├── pull_request_template.md ────▶ PR: Auto-loads template
│   └── WORKFLOW_DIAGRAM.md ──────────▶ This file
│
├── scripts/
│   └── git-workflow.ps1 ─────────────▶ Interactive helper
│
├── Documentation Files
│   ├── CHANGELOG.md ─────────────────▶ Version history
│   ├── CONTRIBUTING.md ──────────────▶ Detailed guide
│   ├── README.md ────────────────────▶ Project overview
│   ├── GIT_WORKFLOW_QUICK_REFERENCE.md ▶ Quick commands
│   └── SETUP_COMPLETE.md ────────────▶ Setup summary
│
├── Configuration Files
│   ├── .commitlintrc.json ───────────▶ Commit rules
│   ├── package.json ─────────────────▶ Scripts & deps
│   └── .gitignore ───────────────────▶ Ignored files
│
└── Source Code
    └── src/
        └── pages/
            └── index.astro ──────────▶ Main page
```

## Timeline Example

```
Week 1: Dec 1-7, 2025
├── Monday: Create dev/2025-12-v1
├── Tue-Thu: Develop features
│   ├── feat(hero): add gradient
│   ├── feat(carousel): add pagination
│   └── fix(navbar): correct alignment
└── Friday: PR to dev, merge

Week 2: Dec 8-14, 2025
├── Monday: Create dev/2025-12-v2
├── Tue-Thu: Develop features
│   ├── feat(footer): add footer
│   ├── docs(readme): update docs
│   └── style(hero): adjust spacing
└── Friday: PR to dev, merge

Week 3: Dec 15-21, 2025
├── Monday: Create dev/2025-12-v3
├── Tue-Thu: Develop features
└── Friday: PR to dev, merge

End of Month: Dec 31, 2025
└── PR from dev to main
    └── Tag: v0.2.0
```

## Quick Decision Tree

```
Need to make changes?
│
├─ Is it a new feature? ──────────▶ feat(scope): message
│
├─ Is it a bug fix? ──────────────▶ fix(scope): message
│
├─ Is it documentation? ──────────▶ docs(scope): message
│
├─ Is it styling/formatting? ─────▶ style(scope): message
│
├─ Is it refactoring? ────────────▶ refactor(scope): message
│
├─ Is it performance? ────────────▶ perf(scope): message
│
├─ Is it a test? ─────────────────▶ test(scope): message
│
└─ Is it maintenance? ────────────▶ chore(scope): message
```

---

**Legend:**
- `─▶` : Flow direction
- `┌─┐` : Process/Action
- `│ │` : Connection
- `▼ ▲` : Direction indicators
