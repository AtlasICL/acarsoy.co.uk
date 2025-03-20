// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
  
    // Determine the current page's filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
    navLinks.forEach(link => {
      // Compare the href attribute with the current page filename
      const linkHref = link.getAttribute('href');
      
      // Remove any existing aria-current attributes
      if (link.hasAttribute('aria-current')) {
        link.removeAttribute('aria-current');
      }
      
      // Set aria-current="page" for the current page
      if (linkHref === currentPage || 
          (currentPage === '' && linkHref === 'index.html') ||
          (currentPage === 'projects.html' && linkHref === 'projects.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  });
  