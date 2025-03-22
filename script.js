// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');

    // Determine the current page's filename without empty segments (handles trailing slashes)
    const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
    const currentPage = pathSegments.pop() || 'index.html';

    navLinks.forEach(link => {
      // Remove any existing aria-current attributes
      if (link.hasAttribute('aria-current')) {
        link.removeAttribute('aria-current');
      }
      
      // Set aria-current="page" for the current page
      if (link.getAttribute('href') === currentPage ||
          (currentPage === '' && link.getAttribute('href') === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
});
