// Type definitions
interface UploadElements {
  uploadArea: HTMLElement;
  fileInput: HTMLInputElement;
  uploadPreview: HTMLElement;
}

interface ParallaxElements {
  heroSection: HTMLElement;
  heroContent: HTMLElement;
  waveBackground: HTMLElement;
  navbar: HTMLElement;
}

// Multi-Row Carousel functionality
class MultiRowCarousel {
  private carouselRows: Map<string, CarouselRow> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    const rows = document.querySelectorAll('.carousel-row');
    rows.forEach((row) => {
      const rowId = (row as HTMLElement).dataset.rowId;
      if (rowId) {
        const carouselRow = new CarouselRow(row as HTMLElement, rowId);
        this.carouselRows.set(rowId, carouselRow);
      }
    });
  }
}

class CarouselRow {
  private rowElement: HTMLElement;
  private rowId: string;
  private track: HTMLElement;
  private trackWrapper: HTMLElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private pagination: HTMLElement;
  private cards: HTMLElement[];
  
  private currentIndex: number = 0;
  private itemsPerView: number = 4;
  private totalItems: number = 0;
  private totalPages: number = 0;
  private cardWidth: number = 0;
  private gap: number = 20;
  
  private isDragging: boolean = false;
  private startX: number = 0;
  private currentTranslate: number = 0;
  private prevTranslate: number = 0;
  private animationID: number = 0;
  
  private wheelTimeout: number | null = null;

  constructor(rowElement: HTMLElement, rowId: string) {
    this.rowElement = rowElement;
    this.rowId = rowId;
    
    this.track = rowElement.querySelector('.carousel-track') as HTMLElement;
    this.trackWrapper = rowElement.querySelector('.carousel-track-wrapper') as HTMLElement;
    this.prevBtn = rowElement.querySelector('.carousel-nav-prev') as HTMLButtonElement;
    this.nextBtn = rowElement.querySelector('.carousel-nav-next') as HTMLButtonElement;
    this.pagination = rowElement.querySelector('.carousel-pagination') as HTMLElement;
    this.cards = Array.from(rowElement.querySelectorAll('.carousel-card')) as HTMLElement[];
    
    this.totalItems = this.cards.length;
    
    this.init();
  }

  private init(): void {
    this.calculateDimensions();
    this.createPagination();
    this.setupEventListeners();
    this.updateCarousel();
    
    window.addEventListener('resize', () => this.handleResize());
  }

  private calculateDimensions(): void {
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

  private createPagination(): void {
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

  private setupEventListeners(): void {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.nextBtn.addEventListener('click', () => this.navigate(1));
    
    // Mouse wheel scrolling
    this.trackWrapper.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
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

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    
    this.wheelTimeout = window.setTimeout(() => {
      if (e.deltaY < 0) {
        // Scroll up = move right (previous)
        this.navigate(-1);
      } else if (e.deltaY > 0) {
        // Scroll down = move left (next)
        this.navigate(1);
      }
    }, 50);
  }

  private dragStart(e: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.trackWrapper.classList.add('grabbing');
    
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.startX = clientX;
    this.prevTranslate = this.currentTranslate;
    
    this.animationID = requestAnimationFrame(() => this.animation());
    this.track.style.transition = 'none';
  }

  private drag(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const diff = clientX - this.startX;
    this.currentTranslate = this.prevTranslate + diff;
  }

  private dragEnd(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.trackWrapper.classList.remove('grabbing');
    cancelAnimationFrame(this.animationID);
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    const threshold = this.cardWidth / 3;
    
    if (movedBy < -threshold && this.currentIndex < this.totalPages - 1) {
      this.currentIndex++;
    } else if (movedBy > threshold && this.currentIndex > 0) {
      this.currentIndex--;
    }
    
    this.track.style.transition = 'transform 0.35s ease-out';
    this.updateCarousel();
  }

  private animation(): void {
    if (this.isDragging) {
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
      requestAnimationFrame(() => this.animation());
    }
  }

  private handleKeyboard(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.navigate(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigate(1);
    }
  }

  private navigate(direction: number): void {
    const newIndex = this.currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < this.totalPages) {
      this.currentIndex = newIndex;
      this.updateCarousel();
    }
  }

  private goToPage(pageIndex: number): void {
    this.currentIndex = pageIndex;
    this.updateCarousel();
  }

  private updateCarousel(): void {
    const translateX = -(this.currentIndex * this.itemsPerView * (this.cardWidth + this.gap));
    this.currentTranslate = translateX;
    this.prevTranslate = translateX;
    
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Update pagination
    const dots = this.pagination.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update button states
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
    
    // Lazy load images
    this.lazyLoadImages();
  }

  private lazyLoadImages(): void {
    const startIndex = this.currentIndex * this.itemsPerView;
    const endIndex = Math.min(startIndex + this.itemsPerView + 2, this.totalItems);
    
    for (let i = startIndex; i < endIndex; i++) {
      const card = this.cards[i];
      if (card) {
        const img = card.querySelector('img[data-src]') as HTMLImageElement;
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      }
    }
  }

  private handleResize(): void {
    this.calculateDimensions();
    this.createPagination();
    
    // Reset to first page if current page is out of bounds
    if (this.currentIndex >= this.totalPages) {
      this.currentIndex = Math.max(0, this.totalPages - 1);
    }
    
    this.updateCarousel();
  }
}

// Upload functionality
class ImageUploader {
  private uploadedFiles: File[] = [];
  private elements: UploadElements;

  constructor() {
    this.elements = {
      uploadArea: document.getElementById('uploadArea') as HTMLElement,
      fileInput: document.getElementById('fileInput') as HTMLInputElement,
      uploadPreview: document.getElementById('uploadPreview') as HTMLElement
    };
    
    this.init();
  }

  private init(): void {
    this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
    this.elements.fileInput.addEventListener('change', (e) => this.handleFiles((e.target as HTMLInputElement).files));
    
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

  private handleFiles(files: FileList | null | undefined): void {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.uploadedFiles.push(file);
        this.displayPreview(file);
      }
    });
  }

  private displayPreview(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      
      const img = document.createElement('img');
      img.src = e.target?.result as string;
      
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
  private ticking: boolean = false;
  private elements: ParallaxElements;
  private carouselSection: HTMLElement | null;

  constructor() {
    this.elements = {
      heroSection: document.querySelector('.hero-section') as HTMLElement,
      heroContent: document.querySelector('.hero-content') as HTMLElement,
      waveBackground: document.querySelector('.wave-background') as HTMLElement,
      navbar: document.querySelector('.navbar') as HTMLElement
    };
    
    this.carouselSection = document.querySelector('.multi-carousel-section');
    
    this.init();
  }

  private init(): void {
    window.addEventListener('scroll', () => this.requestTick());
    this.setupMouseParallax();
    // Trigger initial check for visible elements
    this.updateParallax();
  }

  private updateParallax(): void {
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

  private requestTick(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => this.updateParallax());
      this.ticking = true;
    }
  }

  private setupMouseParallax(): void {
    this.elements.heroSection.addEventListener('mousemove', (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = this.elements.heroSection;
      
      const xPos = (clientX / offsetWidth - 0.5) * 20;
      const yPos = (clientY / offsetHeight - 0.5) * 20;
      
      const heroTitleImg = document.querySelector('.hero-title-img') as HTMLElement;
      if (heroTitleImg) {
        heroTitleImg.style.transform = `translate(${xPos}px, ${yPos}px)`;
      }
    });

    this.elements.heroSection.addEventListener('mouseleave', () => {
      const heroTitleImg = document.querySelector('.hero-title-img') as HTMLElement;
      if (heroTitleImg) {
        heroTitleImg.style.transform = 'translate(0, 0)';
      }
    });
  }
}

// Scroll animation observer
class ScrollAnimator {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
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

  private init(): void {
    const sectionTitle = document.querySelector('.section-title');
    const uploadSection = document.querySelector('.upload-section');
    
    if (sectionTitle) this.observer.observe(sectionTitle);
    if (uploadSection) this.observer.observe(uploadSection);
    
    this.staggerMediaCards();
    this.setupSmoothScroll();
  }

  private staggerMediaCards(): void {
    document.querySelectorAll('.media-card').forEach((card, index) => {
      (card as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }

  private setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
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
  const multiCarousel = new MultiRowCarousel();
  const uploader = new ImageUploader();
  const parallax = new ParallaxScroller();
  const animator = new ScrollAnimator();
  
  // Trigger parallax check after a short delay to ensure layout is calculated
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
