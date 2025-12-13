# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-12-13

### Changed
- Converted JavaScript to TypeScript (main.tsx)
- Refactored to Object-Oriented Programming with classes
- Added comprehensive type definitions and interfaces
- Improved code maintainability with class-based architecture

### Technical Details
- **Carousel class** - Encapsulates carousel logic
- **ImageUploader class** - Manages upload functionality
- **ParallaxScroller class** - Handles parallax effects
- **ScrollAnimator class** - Controls scroll animations

## [0.2.0] - 2025-12-13

### Added
- Modular component architecture (Navbar, MediaCard, BaseLayout)
- External CSS file (public/styles/main.css) for all styles
- External JavaScript file (public/scripts/main.js) for all functionality
- Dynamic animations with keyframes (fadeIn, scaleIn, float, pulse, etc.)
- Parallax scrolling effects on hero section
- Mouse move parallax on hero logo
- Scroll-triggered animations using Intersection Observer
- Image upload functionality with drag & drop
- Upload preview with remove capability
- Expanded carousel to 5 slides with 3 items each (15 total)
- Staggered entrance animations for media cards

### Changed
- Refactored index.astro from 1100+ lines to ~100 lines
- Separated concerns: CSS, JS, and HTML in different files
- Made media items data-driven with arrays
- Simplified project structure
- Removed unnecessary documentation files
- Cleaned up public folder (removed duplicate fonts)
- Updated package.json to remove unused dependencies

### Removed
- Inline styles and scripts from index.astro
- CONTRIBUTING.md, GIT_WORKFLOW_QUICK_REFERENCE.md, SETUP_COMPLETE.md
- .github/WORKFLOW_DIAGRAM.md
- scripts/ folder and git-workflow.ps1
- Commitlint and Husky dependencies
- Duplicate font files (moderniz.zip, moderniz folder)
- Empty Media folder in src/pages

### Fixed
- Code organization and maintainability
- Reusability of components
- Performance with external file loading

## [0.1.0] - 2025-12-08

### Added
- Initial project setup with Astro
- Basic navbar with navigation links
- Hero section structure
- Creative gallery foundation
