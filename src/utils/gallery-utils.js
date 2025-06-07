/**
 * Shared carousel and lightbox functionality
 * Reduces JavaScript duplication across gallery components
 */

export class LightboxGallery {
  constructor(config) {
    this.gallerySelector = config.gallerySelector;
    this.lightboxId = config.lightboxId;
    this.lightboxImageId = config.lightboxImageId;
    this.imageCaptionId = config.imageCaptionId;
    this.closeButtonId = config.closeButtonId;
    this.prevButtonId = config.prevButtonId;
    this.nextButtonId = config.nextButtonId;
    this.images = config.images || [];
    this.customShowImage = config.customShowImage;
    this.onOpen = config.onOpen;
    this.currentIndex = 0;
    
    this.init();
  }

  init() {
    this.lightbox = document.getElementById(this.lightboxId);
    this.lightboxImage = document.getElementById(this.lightboxImageId);
    this.imageCaption = document.getElementById(this.imageCaptionId);
    this.closeButton = document.getElementById(this.closeButtonId);
    this.prevButton = document.getElementById(this.prevButtonId);
    this.nextButton = document.getElementById(this.nextButtonId);
    this.galleryItems = document.querySelectorAll(this.gallerySelector);

    if (!this.lightbox || !this.lightboxImage || this.galleryItems.length === 0) {
      console.warn('Required lightbox elements not found');
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    // Open lightbox when clicking on gallery items
    this.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Check if there's a custom onOpen handler that returns a different index
        const startIndex = this.onOpen ? this.onOpen(index) : index;
        this.open(startIndex);
      });
    });

    // Close lightbox
    this.closeButton?.addEventListener('click', () => this.close());
    this.lightbox?.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Navigation
    this.prevButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPrevious();
    });
    this.nextButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showNext();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox?.classList.contains('hidden')) {
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.showPrevious();
        if (e.key === 'ArrowRight') this.showNext();
      }
    });
  }

  open(index = 0) {
    this.currentIndex = index;
    this.showImage(this.currentIndex);
    this.lightbox?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage(this.currentIndex);
  }

  showPrevious() {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.showImage(this.currentIndex);
  }

  showImage(index) {
    if (this.customShowImage) {
      // Use custom show image function if provided
      this.customShowImage(index);
    } else {
      // Default image display
      const image = this.images[index];
      if (!image) return;

      if (this.lightboxImage) {
        this.lightboxImage.src = image.src;
        this.lightboxImage.alt = image.alt;
      }

      if (this.imageCaption) {
        this.imageCaption.textContent = image.alt;
      }
    }
  }
}

export class Carousel {
  constructor(config) {
    this.trackId = config.trackId;
    this.prevButtonId = config.prevButtonId;
    this.nextButtonId = config.nextButtonId;
    this.thumbnailSelector = config.thumbnailSelector;
    this.slideSelector = config.slideSelector;
    this.currentSlide = 0;
    
    this.init();
  }

  init() {
    this.track = document.getElementById(this.trackId);
    this.prevButton = document.getElementById(this.prevButtonId);
    this.nextButton = document.getElementById(this.nextButtonId);
    this.slides = document.querySelectorAll(this.slideSelector);
    this.thumbnails = document.querySelectorAll(this.thumbnailSelector);

    if (!this.track || this.slides.length === 0) {
      console.warn('Carousel elements not found');
      return;
    }

    this.bindEvents();
    this.updateButtonStates();
  }

  bindEvents() {
    this.prevButton?.addEventListener('click', () => this.showPrevious());
    this.nextButton?.addEventListener('click', () => this.showNext());

    // Thumbnail clicks
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.goToSlide(index));
    });
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  showNext() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.updateCarousel();
    }
  }

  showPrevious() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update thumbnail states
    this.thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentSlide);
    });
    
    this.updateButtonStates();
  }

  updateButtonStates() {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentSlide === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentSlide === this.slides.length - 1;
    }
  }
}
