// Clean minimal app.js - only essential behaviors for a very basic, responsive portfolio.

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const pages = Array.from(document.querySelectorAll('.page'));
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const loadingOverlay = document.getElementById('loading');
  const contactForm = document.getElementById('contact-form');

  function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `site-notification site-notification--${type}`;
    n.textContent = message;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('visible'));
    setTimeout(() => n.classList.remove('visible'), 2200);
    setTimeout(() => n.remove(), 2600);
  }

  function showPage(id) {
    pages.forEach(p => p.id === id ? p.classList.add('active') : p.classList.remove('active'));
    navLinks.forEach(link => link.dataset.page === id ? link.classList.add('active') : link.classList.remove('active'));
    try { history.replaceState({}, '', `#${id}`); } catch (e) {}
  }

  navLinks.forEach(link => {
    const page = link.dataset.page;
    if (!page) return;
    link.addEventListener('click', (e) => { e.preventDefault(); showPage(page); if (navMenu) navMenu.classList.remove('open'); });
  });

  if (navToggle && navMenu) navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));


  if (loadingOverlay) loadingOverlay.style.display = 'none';

  // Create popup elements
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup__icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <h3 class="popup__title">Thank You!</h3>
    <p class="popup__message">Your message has been sent successfully. We'll get back to you soon.</p>
    <button class="popup__button">Close</button>
  `;
  document.body.appendChild(popup);

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  document.body.appendChild(overlay);

  function showPopup() {
    overlay.classList.add('show');
    popup.classList.add('show');
  }

  function hidePopup() {
    overlay.classList.remove('show');
    popup.classList.remove('show');
  }

  popup.querySelector('.popup__button').addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();
      
      if (!name || !email || !message) { 
        showNotification('Please fill all required fields.', 'error'); 
        return; 
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
        showNotification('Please enter a valid email address.', 'error'); 
        return; 
      }
      
      contactForm.reset();
      showPopup();
    });
  }

  const initialHash = (location.hash || '').replace('#','');
  if (initialHash) showPage(initialHash);
  else showPage('home');

});

// End of file
