/* ============================================
   Theme Toggle Logic
   ============================================ */
(function() {
  const THEME_KEY = 'antinature-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return 'light'; /* Default to light */
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  /* Apply on load (before paint) */
  setTheme(getPreferredTheme());

  /* Toggle handler */
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* Mobile menu toggle */
    const menuBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', function() {
        nav.classList.toggle('navbar__nav--open');
        const isOpen = nav.classList.contains('navbar__nav--open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        menuBtn.innerHTML = isOpen ? '✕' : '☰';
      });

      /* Close menu on link click (mobile) */
      nav.querySelectorAll('.navbar__link').forEach(function(link) {
        link.addEventListener('click', function() {
          nav.classList.remove('navbar__nav--open');
          menuBtn.innerHTML = '☰';
        });
      });
    }
  });
})();
