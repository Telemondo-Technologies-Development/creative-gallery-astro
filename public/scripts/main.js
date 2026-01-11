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
    this.calculateDimensions();
    this.createPagination();
    this.setupEventListeners();
    this.updateCarousel();
    
    window.addEventListener('resize', () => this.handleResize());
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
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(0px)`;
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
    
    const newIndex = this.currentIndex + direction;
    
    // Stop at boundaries - no looping
    if (newIndex < 0 || newIndex >= this.totalPages) {
      return;
    }
    
    this.isTransitioning = true;
    this.currentIndex = newIndex;
    
    // Enable transition for the move
    this.track.style.transition = 'transform 0.35s ease-out';
    this.updateCarousel();
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 350);
  }

  goToPage(pageIndex) {
    this.currentIndex = pageIndex;
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -(this.currentIndex * this.itemsPerView * (this.cardWidth + this.gap));
    this.currentTranslate = translateX;
    this.prevTranslate = translateX;
    
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Update pagination
    const dots = this.pagination.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Disable buttons at boundaries
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.totalPages - 1;
    
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
    // Recalculate dimensions
    this.calculateDimensions();
    this.createPagination();
    
    // Reset to first page if current page is out of bounds
    if (this.currentIndex >= this.totalPages) {
      this.currentIndex = 0;
    }
    
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
    // Check if upload elements exist before attaching listeners
    if (!this.elements.uploadArea || !this.elements.fileInput || !this.elements.uploadPreview) {
      console.log('ImageUploader: Upload section not found, skipping initialization');
      return;
    }
    
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
    if (this.elements.heroSection) {
      this.setupMouseParallax();
    }
    // Trigger initial check for visible elements
    this.updateParallax();
  }

  updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Only apply hero parallax if hero section exists
    if (this.elements.heroSection && this.elements.heroContent) {
      const heroHeight = this.elements.heroSection.offsetHeight;
      
      // Hero section parallax
      if (scrolled < heroHeight) {
        this.elements.heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        this.elements.heroContent.style.opacity = String(1 - (scrolled / heroHeight) * 0.8);
        
        if (this.elements.waveBackground) {
          this.elements.waveBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }
    }
    
    if (this.elements.navbar) {
      this.elements.navbar.classList.toggle('scrolled', scrolled > 50);
    }
    this.ticking = false;
  }

  requestTick() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => this.updateParallax());
      this.ticking = true;
    }
  }

  setupMouseParallax() {
    if (!this.elements.heroSection) return;
    
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

// Video Modal functionality
class VideoModal {
  constructor() {
    this.modal = null;
    this.currentVideo = null;
    this.init();
  }

  init() {
    this.createModal();
    this.setupVideoInteractions();
  }

  createModal() {
    console.log('VideoModal: Creating modal element');
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-video-container">
            <video class="modal-video" controls></video>
          </div>
          <div class="modal-info-sidebar">
            <h2 class="modal-title">Video Title</h2>
            <div class="modal-meta">
              <div class="modal-meta-item">
                <span class="meta-label">Uploaded:</span>
                <span class="meta-value" id="modal-upload-date">-</span>
              </div>
              <div class="modal-meta-item">
                <span class="meta-label">Genre:</span>
                <span class="meta-value" id="modal-genre">-</span>
              </div>
            </div>
            <div class="modal-description">
              <h3>Description</h3>
              <p id="modal-description-text">Creative video content showcasing artistic work.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
    console.log('VideoModal: Modal created and appended to body');

    // Close modal events
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    
    overlay.addEventListener('click', () => this.closeModal());
    closeBtn.addEventListener('click', () => this.closeModal());
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  setupVideoInteractions() {
    console.log('VideoModal: Setting up video interactions');
    
    // Track which cards already have listeners to prevent duplicates
    this.attachedCards = new Set();
    
    const attachListeners = () => {
      const mediaCards = document.querySelectorAll('.media-card');
      console.log('VideoModal: Found', mediaCards.length, 'media cards');
      
      mediaCards.forEach((card, index) => {
        // Skip if already attached
        if (this.attachedCards.has(card)) return;
        
        const video = card.querySelector('video');
        
        if (video) {
          console.log(`VideoModal: Attaching listeners to card ${index + 1}, video:`, video.src);
          
          // Mark as attached
          this.attachedCards.add(card);
          card.dataset.videoListenersAttached = 'true';
          
          // Hover to play
          card.addEventListener('mouseenter', () => {
            if (!this.modal.classList.contains('active')) {
              console.log('VideoModal: Playing video on hover', video.src);
              video.play().catch((err) => console.log('VideoModal: Play error', err));
            }
          });
          
          // Leave to pause
          card.addEventListener('mouseleave', () => {
            if (!this.modal.classList.contains('active')) {
              console.log('VideoModal: Pausing video on leave');
              video.pause();
              video.currentTime = 0;
            }
          });
          
          // Click to open modal
          card.addEventListener('click', (e) => {
            if (!e.target.closest('.carousel-nav-btn')) {
              console.log('VideoModal: Opening modal with video', video.src);
              const videoData = {
                src: video.src,
                title: card.dataset.title || 'Creative Video',
                uploadDate: card.dataset.uploadDate || new Date().toLocaleDateString(),
                genre: card.dataset.genre || 'Creative'
              };
              this.openModal(videoData);
            }
          });
        }
      });
    };
    
    // Attach immediately
    attachListeners();
    
    // Attach after delays to catch dynamically loaded content
    setTimeout(attachListeners, 500);
    setTimeout(attachListeners, 1500);
    setTimeout(attachListeners, 3000);
    
    // Also observe for new media cards being added to DOM
    const observer = new MutationObserver(() => {
      attachListeners();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  openModal(videoData) {
    console.log('VideoModal: openModal called with data:', videoData);
    
    if (!this.modal) {
      console.error('VideoModal: Modal element not found!');
      return;
    }
    
    const modalVideo = this.modal.querySelector('.modal-video');
    if (!modalVideo) {
      console.error('VideoModal: Modal video element not found!');
      return;
    }
    
    console.log('VideoModal: Setting video source to:', videoData.src);
    modalVideo.src = videoData.src;
    this.currentVideo = modalVideo;
    
    // Update modal info
    const titleEl = this.modal.querySelector('.modal-title');
    const uploadDateEl = this.modal.querySelector('#modal-upload-date');
    const genreEl = this.modal.querySelector('#modal-genre');
    const descEl = this.modal.querySelector('#modal-description-text');
    
    if (titleEl) titleEl.textContent = videoData.title;
    if (uploadDateEl) uploadDateEl.textContent = videoData.uploadDate;
    if (genreEl) genreEl.textContent = videoData.genre;
    if (descEl) descEl.textContent = `${videoData.title} - A creative video showcasing artistic work in the ${videoData.genre} genre.`;
    
    console.log('VideoModal: Updated modal info');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    this.modal.classList.add('active');
    console.log('VideoModal: Modal should now be visible with class "active"');
    
    // Play video after modal opens
    setTimeout(() => {
      modalVideo.play().catch((err) => console.log('VideoModal: Video play error:', err));
    }, 300);
  }

  closeModal() {
    const modalVideo = this.modal.querySelector('.modal-video');
    modalVideo.pause();
    modalVideo.src = '';
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Hide modal with animation
    this.modal.classList.remove('active');
    this.currentVideo = null;
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
    
    this.setupSmoothScroll();
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

// Set active state for home link based on current page
function setActiveNavLink() {
  const homeLink = document.getElementById('homeLink');
  if (homeLink) {
    const currentPath = window.location.pathname;
    // Only add active class if on home page (/ or /index.html)
    if (currentPath === '/' || currentPath === '/index.html') {
      homeLink.classList.add('active');
    } else {
      homeLink.classList.remove('active');
    }
  }
}

// Initialize all modules after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const themeManager = new ThemeManager();
  const multiCarousel = new MultiRowCarousel();
  const uploader = new ImageUploader();
  const parallax = new ParallaxScroller();
  const animator = new ScrollAnimator();
  const videoModal = new VideoModal();
  
  // Set active nav link based on current page
  setActiveNavLink();
  
  // Trigger parallax check after a short delay to ensure layout is calculated
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
