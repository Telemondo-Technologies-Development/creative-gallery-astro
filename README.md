# Creative Gallery - Astro

A modern, minimalist creative gallery platform built with Astro featuring dynamic animations, parallax scrolling, and image upload functionality.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
creative-gallery-astro/
├── public/
│   ├── fonts/
│   │   └── Moderniz.otf          # Custom font
│   ├── scripts/
│   │   └── main.tsx              # All TypeScript functionality (OOP)
│   ├── styles/
│   │   └── main.css              # All styles and animations
│   ├── favicon.svg
│   └── hero-title.svg
├── src/
│   ├── components/
│   │   ├── MediaCard.astro       # Reusable media card component
│   │   └── Navbar.astro          # Navigation component
│   ├── layouts/
│   │   └── BaseLayout.astro      # Base HTML layout
│   └── pages/
│       └── index.astro           # Main page (clean & minimal)
├── package.json
└── astro.config.mjs
```

## ✨ Features

### Core Features
- **Hero Section** with animated gradient logo and wave background
- **Media Carousel** with 5 slides, 3 items per slide (15 total media items)
- **Image Upload** with drag & drop, preview, and remove functionality
- **Category Pills** for content filtering
- **Responsive Design** - Mobile, tablet, and desktop optimized

### Animations & Effects
- **Parallax Scrolling** on hero content and wave background
- **Mouse Move Parallax** on hero logo
- **Scroll-triggered Animations** using Intersection Observer
- **Staggered Entrance** animations for media cards
- **Smooth Transitions** throughout the UI
- **Floating & Pulsing** effects on key elements

### Code Organization
- **Modular Components** - Reusable Astro components
- **Separated Concerns** - CSS and JS in external files
- **Data-Driven** - Media items defined as arrays
- **Clean Code** - Minimal, maintainable, and well-structured

## 🎨 Customization

### Adding Media Items
Edit `src/pages/index.astro`:
```javascript
const mediaItems = [
  [
    { title: 'Your Title', type: 'Video', icon: '▶' },
    // Add more items...
  ]
];
```

### Modifying Styles
Edit `public/styles/main.css` to customize colors, animations, and layout.

### Updating Functionality
Edit `public/scripts/main.tsx` to modify carousel, upload, or parallax behavior.

## 🛠️ Tech Stack

- **Astro** - Static site generator
- **TypeScript** - Type-safe, class-based architecture
- **CSS3** - Modern animations and grid layouts
- **HTML5** - Semantic markup

## 💡 Code Architecture

The TypeScript code uses **Object-Oriented Programming** with four main classes:
- **Carousel** - Manages slide navigation and dots
- **ImageUploader** - Handles file uploads and previews
- **ParallaxScroller** - Controls scroll-based animations
- **ScrollAnimator** - Manages intersection observer and smooth scrolling

## 📝 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## 🔗 Resources

- [Astro Documentation](https://docs.astro.build)
- [Project Repository](https://github.com/Telemondo-Technologies-Development/creative-gallery-astro)

---

**Current Version:** 0.2.0  
**License:** Private  
**Maintained by:** Telemondo Technologies Development
