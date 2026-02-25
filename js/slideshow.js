/**
 * Slideshow component with lazy loading and navigation
 * Supports multiple slideshows on a single page with independent navigation
 */
(function() {
    var slideshows;
    var slideIndices;

    document.addEventListener('DOMContentLoaded', function() {
        slideshows = document.querySelectorAll('.slideshow-wrapper');
        slideIndices = Array(slideshows.length).fill(1);

        slideshows.forEach(function(slideshow, index) {
            showSlides(1, index);
            setupLazyLoading(slideshow);

            // Previous/next button handlers
            slideshow.querySelector('.prev').addEventListener('click', function() {
                changeSlide(-1, index);
            });

            slideshow.querySelector('.next').addEventListener('click', function() {
                changeSlide(1, index);
            });

            // Navigation dot handlers
            slideshow.querySelectorAll('.dot').forEach(function(dot, dotIndex) {
                dot.addEventListener('click', function() {
                    goToSlide(dotIndex + 1, index);
                });
            });
        });
    });

    /**
     * Navigate to previous or next slide
     * @param {number} n - Direction: -1 for previous, 1 for next
     * @param {number} slideshowIndex - Index of the slideshow to affect
     */
    function changeSlide(n, slideshowIndex) {
        showSlides(slideIndices[slideshowIndex] += n, slideshowIndex);
    }

    /**
     * Jump to a specific slide
     * @param {number} n - Target slide number (1-based index)
     * @param {number} slideshowIndex - Index of the slideshow to affect
     */
    function goToSlide(n, slideshowIndex) {
        showSlides(slideIndices[slideshowIndex] = n, slideshowIndex);
    }

    /**
     * Update slideshow display to show the specified slide
     * Handles slide wraparound, updates indicators, and manages lazy loading
     *
     * @param {number} n - Target slide number
     * @param {number} slideshowIndex - Index of the slideshow to affect
     */
    function showSlides(n, slideshowIndex) {
        var slideshow = slideshows[slideshowIndex];
        var slides = slideshow.querySelectorAll('.slide');
        var dots = slideshow.querySelectorAll('.dot');

        // Handle wraparound at beginning and end
        if (n > slides.length) { slideIndices[slideshowIndex] = 1; }
        if (n < 1) { slideIndices[slideshowIndex] = slides.length; }

        // Hide all slides
        slides.forEach(function(slide) {
            slide.style.display = "none";
        });

        // Reset all indicator dots
        dots.forEach(function(dot) {
            dot.classList.remove('active-dot');
        });

        // Show the target slide and highlight its indicator
        var currentIndex = slideIndices[slideshowIndex] - 1;
        slides[currentIndex].style.display = "block";
        dots[currentIndex].classList.add('active-dot');

        // Load the current slide's image if it's using lazy loading
        var currentSlide = slides[currentIndex];
        var img = currentSlide.querySelector('img[data-src]');
        if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        // Preload the next slide's image for smoother transitions
        var nextIndex = (slideIndices[slideshowIndex] % slides.length);
        var nextSlide = slides[nextIndex];
        var nextImg = nextSlide.querySelector('img[data-src]');
        if (nextImg) {
            var preloadImg = new Image();
            preloadImg.src = nextImg.dataset.src;
        }
    }

    /**
     * Configure lazy loading for slideshow images
     * First slide loads immediately, others load when slideshow becomes visible
     *
     * @param {Element} slideshow - Slideshow container element
     */
    function setupLazyLoading(slideshow) {
        var slides = slideshow.querySelectorAll('.slide');

        // Convert image sources to data attributes except for the first slide
        slides.forEach(function(slide, index) {
            var img = slide.querySelector('img');
            if (img && index > 0) { // Keep first slide loaded for initial view
                img.dataset.src = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
            }
        });

        // Use IntersectionObserver for modern browsers
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        // Load current slide image when slideshow becomes visible
                        var slideshowIndex = Array.from(slideshows).indexOf(slideshow);
                        var currentIndex = slideIndices[slideshowIndex] - 1;
                        var currentSlide = slides[currentIndex];
                        var img = currentSlide.querySelector('img[data-src]');
                        if (img) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            observer.observe(slideshow);
        }
    }
})();
