// Dark Mode functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.currentTheme = this.getInitialTheme();
    this.init();
  }

  getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  getTheme() {
    return this.currentTheme;
  }
}

// Multi-Row Carousel functionality
class MultiRowCarousel {
  constructor() {
    this.carouselRows = new Map();
    this.init();
  }

  init() {
    const rows = document.querySelectorAll('.carousel-row');
    rows.forEach((row) => {
      const rowId = row.dataset.rowId;
      if (rowId) {
        const carouselRow = new CarouselRow(row, rowId);
        this.carouselRows.set(rowId, carouselRow);
      }
    });
  }
}

class CarouselRow {
  constructor(rowElement, rowId) {
    this.rowElement = rowElement;
    this.rowId = rowId;
    
    this.track = rowElement.querySelector('.carousel-track');
    this.trackWrapper = rowElement.querySelector('.carousel-track-wrapper');
    this.prevBtn = rowElement.querySelector('.carousel-nav-prev');
    this.nextBtn = rowElement.querySelector('.carousel-nav-next');
    this.pagination = rowElement.querySelector('.carousel-pagination');
    this.cards = Array.from(rowElement.querySelectorAll('.carousel-card'));
    
    this.totalItems = this.cards.length;
    
    this.currentIndex = 0;
    this.itemsPerView = 4;
    this.totalPages = 0;
    this.cardWidth = 0;
    this.gap = 20;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    this.wheelTimeout = null;
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    this.cloneItemsForLoop();
    this.calculateDimensions();
    this.createPagination();
    this.setupEventListeners();
    this.setInitialPosition();
    this.updateCarousel();
    
    window.addEventListener('resize', () => this.handleResize());
  }

  cloneItemsForLoop() {
    // Clone items at the end for seamless looping
    const clonesToAdd = this.itemsPerView || 4;
    
    // Clone first items and append to end
    for (let i = 0; i < clonesToAdd; i++) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('cloned');
      this.track.appendChild(clone);
    }
    
    // Clone last items and prepend to beginning
    for (let i = this.totalItems - 1; i >= this.totalItems - clonesToAdd && i >= 0; i--) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('cloned');
      this.track.insertBefore(clone, this.track.firstChild);
    }
  }

  calculateDimensions() {
    const wrapperWidth = this.trackWrapper.offsetWidth;
    const computedStyle = window.getComputedStyle(this.track);
    this.gap = parseFloat(computedStyle.gap) || 20;
    
    // Calculate items per view based on viewport
    if (window.innerWidth <= 768) {
      this.itemsPerView = 2;
    } else if (window.innerWidth <= 1024) {
      this.itemsPerView = 3;
    } else if (window.innerWidth >= 1441) {
      this.itemsPerView = 5;
    } else {
      this.itemsPerView = 4;
    }
    
    this.cardWidth = (wrapperWidth - (this.gap * (this.itemsPerView - 1))) / this.itemsPerView;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerView);
  }

  setInitialPosition() {
    // Start at the first real item (after cloned items)
    const offset = this.itemsPerView * (this.cardWidth + this.gap);
    this.currentTranslate = -offset;
    this.prevTranslate = -offset;
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  createPagination() {
    this.pagination.innerHTML = '';
    
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'pagination-dot';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToPage(i));
      this.pagination.appendChild(dot);
    }
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.nextBtn.addEventListener('click', () => this.navigate(1));
    
    // Drag functionality
    this.trackWrapper.addEventListener('mousedown', (e) => this.dragStart(e));
    this.trackWrapper.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
    
    this.trackWrapper.addEventListener('mousemove', (e) => this.drag(e));
    this.trackWrapper.addEventListener('touchmove', (e) => this.drag(e), { passive: true });
    
    this.trackWrapper.addEventListener('mouseup', () => this.dragEnd());
    this.trackWrapper.addEventListener('touchend', () => this.dragEnd());
    this.trackWrapper.addEventListener('mouseleave', () => this.dragEnd());
    
    // Prevent context menu on drag
    this.trackWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Keyboard navigation
    this.rowElement.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  dragStart(e) {
    this.isDragging = true;
    this.trackWrapper.classList.add('grabbing');
    
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.startX = clientX;
    this.prevTranslate = this.currentTranslate;
    
    this.animationID = requestAnimationFrame(() => this.animation());
    this.track.style.transition = 'none';
  }

  drag(e) {
    if (!this.isDragging) return;
    
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const diff = clientX - this.startX;
    this.currentTranslate = this.prevTranslate + diff;
  }

  dragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.trackWrapper.classList.remove('grabbing');
    cancelAnimationFrame(this.animationID);
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    const threshold = this.cardWidth / 3;
    
    if (movedBy < -threshold) {
      this.navigate(1);
    } else if (movedBy > threshold) {
      this.navigate(-1);
    } else {
      this.track.style.transition = 'transform 0.35s ease-out';
      this.updateCarousel();
    }
  }

  animation() {
    if (this.isDragging) {
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
      requestAnimationFrame(() => this.animation());
    }
  }

  handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.navigate(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigate(1);
    }
  }

  navigate(direction) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentIndex += direction;
    
    // Enable transition for the move
    this.track.style.transition = 'transform 0.35s ease-out';
    this.updateCarousel();
    
    // Handle infinite loop wrapping after transition
    const transitionEndHandler = () => {
      if (this.currentIndex >= this.totalPages) {
        this.track.style.transition = 'none';
        this.currentIndex = 0;
        this.setInitialPosition();
        this.updateCarouselWithoutTransition();
        requestAnimationFrame(() => {
          this.track.style.transition = 'transform 0.35s ease-out';
          this.isTransitioning = false;
        });
      } else if (this.currentIndex < 0) {
        this.track.style.transition = 'none';
        this.currentIndex = this.totalPages - 1;
        const offset = this.itemsPerView * (this.cardWidth + this.gap);
        const translateX = -(this.currentIndex * this.itemsPerView * (this.cardWidth + this.gap)) - offset;
        this.currentTranslate = translateX;
        this.prevTranslate = translateX;
        this.track.style.transform = `translateX(${translateX}px)`;
        this.updateCarouselWithoutTransition();
        requestAnimationFrame(() => {
          this.track.style.transition = 'transform 0.35s ease-out';
          this.isTransitioning = false;
        });
      } else {
        this.isTransitioning = false;
      }
    };
    
    // Use setTimeout as fallback in case transitionend doesn't fire
    this.track.removeEventListener('transitionend', this.transitionEndHandler);
    this.transitionEndHandler = transitionEndHandler;
    this.track.addEventListener('transitionend', transitionEndHandler, { once: true });
    
    setTimeout(() => {
      if (this.isTransitioning) {
        transitionEndHandler();
      }
    }, 400);
  }

  goToPage(pageIndex) {
    this.currentIndex = pageIndex;
    this.updateCarousel();
  }

  updateCarousel() {
    const offset = this.itemsPerView * (this.cardWidth + this.gap);
    const translateX = -(this.currentIndex * this.itemsPerView * (this.cardWidth + this.gap)) - offset;
    this.currentTranslate = translateX;
    this.prevTranslate = translateX;
    
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Update pagination
    const dots = this.pagination.querySelectorAll('.pagination-dot');
    const actualIndex = ((this.currentIndex % this.totalPages) + this.totalPages) % this.totalPages;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === actualIndex);
    });
    
    // Buttons always enabled for infinite loop
    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
    
    // Lazy load images
    this.lazyLoadImages();
  }

  updateCarouselWithoutTransition() {
    // Update pagination only
    const dots = this.pagination.querySelectorAll('.pagination-dot');
    const actualIndex = ((this.currentIndex % this.totalPages) + this.totalPages) % this.totalPages;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === actualIndex);
    });
  }

  lazyLoadImages() {
    const startIndex = this.currentIndex * this.itemsPerView;
    const endIndex = Math.min(startIndex + this.itemsPerView + 2, this.totalItems);
    
    for (let i = startIndex; i < endIndex; i++) {
      const card = this.cards[i];
      if (card) {
        const img = card.querySelector('img[data-src]');
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      }
    }
  }

  handleResize() {
    // Remove old clones
    const clonedElements = this.track.querySelectorAll('.cloned');
    clonedElements.forEach(el => el.remove());
    
    // Recalculate and re-clone
    this.calculateDimensions();
    this.cloneItemsForLoop();
    this.createPagination();
    
    // Reset to first page if current page is out of bounds
    if (this.currentIndex >= this.totalPages) {
      this.currentIndex = 0;
    }
    
    this.setInitialPosition();
    this.updateCarousel();
  }
}

// Upload functionality
class ImageUploader {
  constructor() {
    this.uploadedFiles = [];
    this.elements = {
      uploadArea: document.getElementById('uploadArea'),
      fileInput: document.getElementById('fileInput'),
      uploadPreview: document.getElementById('uploadPreview')
    };
    
    this.init();
  }

  init() {
    this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
    this.elements.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
    
    this.elements.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.elements.uploadArea.classList.add('dragover');
    });

    this.elements.uploadArea.addEventListener('dragleave', () => {
      this.elements.uploadArea.classList.remove('dragover');
    });

    this.elements.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.elements.uploadArea.classList.remove('dragover');
      this.handleFiles(e.dataTransfer?.files);
    });
  }

  handleFiles(files) {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.uploadedFiles.push(file);
        this.displayPreview(file);
      }
    });
  }

  displayPreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      
      const img = document.createElement('img');
      img.src = e.target?.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'preview-remove';
      removeBtn.innerHTML = '×';
      removeBtn.onclick = () => {
        const index = this.uploadedFiles.indexOf(file);
        if (index > -1) this.uploadedFiles.splice(index, 1);
        previewItem.remove();
      };
      
      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      this.elements.uploadPreview.appendChild(previewItem);
    };
    
    reader.readAsDataURL(file);
  }
}

// Parallax scrolling
class ParallaxScroller {
  constructor() {
    this.ticking = false;
    this.elements = {
      heroSection: document.querySelector('.hero-section'),
      heroContent: document.querySelector('.hero-content'),
      waveBackground: document.querySelector('.wave-background'),
      navbar: document.querySelector('.navbar')
    };
    
    this.carouselSection = document.querySelector('.multi-carousel-section');
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.requestTick());
    this.setupMouseParallax();
    // Trigger initial check for visible elements
    this.updateParallax();
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = this.elements.heroSection.offsetHeight;
    
    // Hero section parallax
    if (scrolled < heroHeight) {
      this.elements.heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      this.elements.heroContent.style.opacity = String(1 - (scrolled / heroHeight) * 0.8);
      
      if (this.elements.waveBackground) {
        this.elements.waveBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
    
    this.elements.navbar.classList.toggle('scrolled', scrolled > 50);
    this.ticking = false;
  }

  requestTick() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => this.updateParallax());
      this.ticking = true;
    }
  }

  setupMouseParallax() {
    this.elements.heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = this.elements.heroSection;
      
      const xPos = (clientX / offsetWidth - 0.5) * 20;
      const yPos = (clientY / offsetHeight - 0.5) * 20;
      
      const heroTitleImg = document.querySelector('.hero-title-img');
      if (heroTitleImg) {
        heroTitleImg.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
    });

    this.elements.heroSection.addEventListener('mouseleave', () => {
      const heroTitleImg = document.querySelector('.hero-title-img');
      if (heroTitleImg) {
        heroTitleImg.style.transform = 'translate(0, 0)';
      }
    });
  }
}

// Scroll animation observer
class ScrollAnimator {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    this.init();
  }

  init() {
    const sectionTitle = document.querySelector('.section-title');
    const uploadSection = document.querySelector('.upload-section');
    
    if (sectionTitle) this.observer.observe(sectionTitle);
    if (uploadSection) this.observer.observe(uploadSection);
    
    this.staggerMediaCards();
    this.setupSmoothScroll();
  }

  staggerMediaCards() {
    document.querySelectorAll('.media-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        const target = href ? document.querySelector(href) : null;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// Initialize all modules after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const themeManager = new ThemeManager();
  const multiCarousel = new MultiRowCarousel();
  const uploader = new ImageUploader();
  const parallax = new ParallaxScroller();
  const animator = new ScrollAnimator();
  
  // Trigger parallax check after a short delay to ensure layout is calculated
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
