// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
  
    // Determine the current page's filename
    const currentPage = window.location.pathname.split('/').pop();
  
    navLinks.forEach(link => {
      // Compare the href attribute with the current page filename
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else if (link.hasAttribute('aria-current')) {
        link.removeAttribute('aria-current');
      }
    });
  });
  