/**
 * Wild Form Yoga — Main JavaScript
 * Vanilla JS for: announcement bar, sticky header, mobile nav,
 * FAQ accordion, scroll animations, email capture
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. ANNOUNCEMENT BAR — Rotating Messages
  // ==========================================================================
  function initAnnouncementBar() {
    const messages = document.querySelectorAll('.announcement-bar__message');
    if (messages.length < 2) return;

    let current = 0;
    const INTERVAL = 4500;

    setInterval(function () {
      messages[current].classList.remove('is-active');
      current = (current + 1) % messages.length;
      messages[current].classList.add('is-active');
    }, INTERVAL);
  }

  // ==========================================================================
  // 2. STICKY HEADER — Shrink on Scroll
  // ==========================================================================
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const SCROLL_THRESHOLD = 50;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ==========================================================================
  // 3. MOBILE NAVIGATION
  // ==========================================================================
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const overlay = document.getElementById('nav-overlay');
    if (!toggle || !links) return;

    function openMenu() {
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      links.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (links.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    links.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ==========================================================================
  // 4. SMOOTH SCROLL for Anchor Links
  // ==========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var headerHeight = document.getElementById('site-header')?.offsetHeight || 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, '', href);
      });
    });
  }

  // ==========================================================================
  // 5. FAQ ACCORDION
  // ==========================================================================
  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            var otherQuestion = other.querySelector('.faq__question');
            var otherAnswer = other.querySelector('.faq__answer');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // ==========================================================================
  // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================================================
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // 7. EMAIL CAPTURE FORM
  // ==========================================================================
  function initEmailCapture() {
    var form = document.getElementById('email-form');
    var success = document.getElementById('email-success');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('.email-form__input');
      if (!email || !email.value) return;

      // In production, this would POST to your email service.
      // For now, show success state.
      form.style.display = 'none';
      success.classList.add('is-visible');
    });
  }

  // ==========================================================================
  // 8. LAZY VIDEO LOADING
  // ==========================================================================
  function initLazyVideo() {
    var videos = document.querySelectorAll('video[autoplay]');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var video = entry.target;
            // Ensure the video plays when visible
            video.play().catch(function () {
              // Autoplay blocked by browser — that's fine
            });
            observer.unobserve(video);
          }
        });
      },
      { threshold: 0.25 }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  // ==========================================================================
  // INITIALIZE
  // ==========================================================================
  function init() {
    initAnnouncementBar();
    initStickyHeader();
    initMobileNav();
    initSmoothScroll();
    initFAQ();
    initScrollReveal();
    initEmailCapture();
    initLazyVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
