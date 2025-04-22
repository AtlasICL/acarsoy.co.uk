// Track slides for each slideshow on the page
const slideshows = document.querySelectorAll('.slideshow-wrapper');
const slideIndices = Array(slideshows.length).fill(1);

// Initialize all slideshows with lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Initialize each slideshow
    slideshows.forEach((slideshow, index) => {
        showSlides(1, index);
        
        // Set up Intersection Observer for lazy loading
        setupLazyLoading(slideshow);
    });
});

// Next/previous controls
function changeSlide(n, slideshowIndex) {
    showSlides(slideIndices[slideshowIndex] += n, slideshowIndex);
}

// Thumbnail image controls
function currentSlide(n, slideshowIndex) {
    showSlides(slideIndices[slideshowIndex] = n, slideshowIndex);
}

function showSlides(n, slideshowIndex) {
    const slideshow = slideshows[slideshowIndex];
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');
    
    // Handle wrapping around at the ends
    if (n > slides.length) {slideIndices[slideshowIndex] = 1}
    if (n < 1) {slideIndices[slideshowIndex] = slides.length}
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = "none";
    });
    
    // Remove active state from all dots
    dots.forEach(dot => {
        dot.className = dot.className.replace(" active-dot", "");
    });
    
    // Show the current slide and activate current dot
    slides[slideIndices[slideshowIndex]-1].style.display = "block";
    dots[slideIndices[slideshowIndex]-1].className += " active-dot";
    
    // Lazy load the current slide image if it hasn't been loaded yet
    const currentSlide = slides[slideIndices[slideshowIndex]-1];
    const img = currentSlide.querySelector('img[data-src]');
    if (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }
    
    // Preload the next slide's image to improve user experience
    const nextIndex = (slideIndices[slideshowIndex] % slides.length) || slides.length;
    const nextSlide = slides[nextIndex-1];
    const nextImg = nextSlide.querySelector('img[data-src]');
    if (nextImg) {
        const preloadImg = new Image();
        preloadImg.src = nextImg.dataset.src;
    }
}

// Setup lazy loading for a slideshow
function setupLazyLoading(slideshow) {
    // Convert all image src attributes to data-src except for the first slide
    const slides = slideshow.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img && index > 0) { // Keep the first slide loaded for initial view
            img.dataset.src = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Tiny transparent placeholder
        }
    });
    
    // If we have IntersectionObserver support, use it for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When slideshow is visible, load the current slide
                    const currentIndex = slideIndices[Array.from(slideshows).indexOf(slideshow)] - 1;
                    const currentSlide = slides[currentIndex];
                    const img = currentSlide.querySelector('img[data-src]');
                    if (img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // Stop observing once visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px', // Load when within 50px of viewport
            threshold: 0.1 // Trigger when 10% visible
        });
        
        // Observe the slideshow wrapper
        observer.observe(slideshow);
    }
}

// Add event listeners to navigation elements
slideshows.forEach((slideshow, index) => {
    // Add event listeners to navigation buttons
    slideshow.querySelector('.prev').onclick = function() {
        changeSlide(-1, index);
    };
    
    slideshow.querySelector('.next').onclick = function() {
        changeSlide(1, index);
    };
    
    // Add event listeners to dots
    const dots = slideshow.querySelectorAll('.dot');
    dots.forEach((dot, dotIndex) => {
        dot.onclick = function() {
            currentSlide(dotIndex + 1, index);
        };
    });
}); 