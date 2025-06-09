/**
 * Shared utility for scroll-triggered animations
 * Reduces JavaScript duplication across components
 */

let isInitialized = false;

export function initScrollAnimations() {
  // Prevent multiple initializations
  if (isInitialized) return;
  isInitialized = true;

  const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
  
  if (scrollAnimateElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,  // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px'  // Slight offset to trigger before fully in view
  });
  
  scrollAnimateElements.forEach(element => {
    // Reset initial state
    element.classList.remove('animate');
    observer.observe(element);
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}
