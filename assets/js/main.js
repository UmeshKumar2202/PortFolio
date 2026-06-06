/**
 * Premium Portfolio — Interactions
 * Performance-first: passive listeners, IntersectionObserver, no layout thrashing
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme Toggle ---- */
  var html = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var storedTheme = localStorage.getItem('theme');

  if (storedTheme) {
    html.setAttribute('data-theme', storedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---- Navigation Scroll State ---- */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile Nav ---- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open');
    });

    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  /* ---- Active Nav Link on Scroll ---- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---- Reveal on Scroll ---- */
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- Project Card Mouse Glow ---- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      }, { passive: true });
    });
  }

  /* ---- Hero Role Text Cycle ---- */
  var roleEl = document.getElementById('hero-role-text');
  if (roleEl && !prefersReducedMotion) {
    var roles = [
      'AI & Data Engineering',
      'GenAI · LLM Systems',
      'ML Pipeline Architecture',
      'Healthcare Analytics'
    ];
    var roleIndex = 0;

    roleEl.style.transition = 'opacity 300ms ease, transform 300ms ease';

    setInterval(function () {
      roleEl.style.opacity = '0';
      roleEl.style.transform = 'translateY(8px)';
      setTimeout(function () {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        roleEl.style.opacity = '1';
        roleEl.style.transform = 'translateY(0)';
      }, 300);
    }, 3500);
  }

  /* ---- Smooth anchor scroll with offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
})();
