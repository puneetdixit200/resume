// Clean minimal app.js - only essential behaviors for a very basic, responsive portfolio.

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const pages = Array.from(document.querySelectorAll('.page'));
  const themeToggle = document.getElementById('theme-toggle');
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

  // Theme handling
  function setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('color-scheme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // Check for system dark mode preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Get saved theme or use system preference
  const savedTheme = localStorage.getItem('color-scheme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }

  // Listen for system theme changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-color-scheme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  if (loadingOverlay) loadingOverlay.style.display = 'none';

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();
      if (!name || !email || !message) { showNotification('Please fill all required fields.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('Please enter a valid email address.', 'error'); return; }
      contactForm.reset();
      showNotification('Message sent. Thank you!', 'success');
    });
  }

  const initialHash = (location.hash || '').replace('#','');
  if (initialHash) showPage(initialHash);
  else showPage('home');

});

// End of file
