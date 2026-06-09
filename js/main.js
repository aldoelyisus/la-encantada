/* ================================================================
   LA ENCANTADA — Main JavaScript
   Interacciones, animaciones y funcionalidad general
================================================================ */

'use strict';

/* ── Navbar Scroll ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

if (navbar) {
  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load
}

/* ── Hamburger / Mobile Menu ────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close when clicking a mobile link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/* ── Scroll Reveal (Intersection Observer) ──────────────────── */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation for grid children
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Add stagger delays to grid siblings
  document.querySelectorAll('.servicios-grid, .stats-grid, .menu-items-grid, .menu-full-grid, .entertainment-grid').forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.dataset.delay = i * 80;
    });
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ── Hero Parallax ──────────────────────────────────────────── */
const heroBg = document.getElementById('hero-bg');
let heroLoaded = false;

if (heroBg) {
  const handleParallax = () => {
    if (!heroLoaded) return;
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${scrollY * 0.3}px)`;
  };
  window.addEventListener('scroll', handleParallax, { passive: true });
}

/* ── Menu Category Tabs ─────────────────────────────────────── */
const menuCatBtns = document.querySelectorAll('.menu-cat-btn');

if (menuCatBtns.length > 0) {
  menuCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.panel;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Deactivate all
      menuCatBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      panel.classList.add('active');

      // Re-trigger reveal for newly visible items
      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    });
  });
}

/* ── QR Code Generation ─────────────────────────────────────── */
const qrCanvas = document.getElementById('qr-canvas');
const qrContainer = document.getElementById('qr-canvas-container');

if (qrContainer && typeof QRCode !== 'undefined') {
  // Get the URL for the menu page
  const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
  const menuUrl = baseUrl + 'menu.html';

  // Clear container and create QR
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: menuUrl,
    width: 160,
    height: 160,
    colorDark: '#2C1505',
    colorLight: '#FFFDF7',
    correctLevel: QRCode.CorrectLevel.M,
  });
} else if (qrContainer && typeof QRCode === 'undefined') {
  // Fallback: show text link
  qrContainer.innerHTML = `
    <div style="width:160px;height:160px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:0.8rem;color:var(--text-muted);padding:1rem;border:2px dashed var(--cream-dark);border-radius:8px;">
      <span>🔗 Abre el menú en <strong>tu navegador</strong></span>
    </div>
  `;
}

/* ── Back to Top Button ─────────────────────────────────────── */
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
  const handleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth Anchor Scrolling ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* ── Counter Animation for Stats ────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statNumbers.length > 0) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.textContent.includes('+') ? '+' : '';
        let current = 0;
        const duration = 1200;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 16);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));
}

/* ── Hero BG Zoom on Load ───────────────────────────────────── */
if (heroBg) {
  window.addEventListener('load', () => {
    heroBg.style.transition = 'transform 1.5s ease';
    heroBg.style.transform = 'scale(1)';
    setTimeout(() => {
      heroLoaded = true;
      heroBg.style.transition = 'none';
    }, 1600);
  });
}
