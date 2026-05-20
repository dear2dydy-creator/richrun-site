/* RICHRUN.BIZ — interactions */

(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- popup modal ---------- */
  const modal = $('#modal');
  const form = $('#diagnose-form');
  const success = $('.modal__success');
  let lastFocus = null;

  function openModal(trigger) {
    lastFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = modal.querySelector('input, select, textarea, button');
      firstInput && firstInput.focus();
    }, 60);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    form.hidden = false;
    success.hidden = true;
    form.reset();
    lastFocus && lastFocus.focus();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-popup]');
    if (opener) {
      e.preventDefault();
      openModal(opener);
      return;
    }
    if (e.target.closest('[data-close]')) {
      e.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* Card whole-card click opens modal */
  $$('.card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      openModal(card);
    });
  });

  /* Form submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    success.hidden = false;
  });

  /* ---------- mobile accordion toggle ---------- */
  $$('.services__head').forEach((head) => {
    const toggle = document.createElement('span');
    toggle.className = 'services__toggle';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.textContent = '+';
    head.appendChild(toggle);
    head.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        const section = head.closest('.services');
        section.classList.toggle('is-open');
        if (section.classList.contains('is-open')) {
          // smooth scroll to keep header in view
          setTimeout(() => {
            head.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }
    });
  });

  /* ---------- filter chips ---------- */
  const chips = $$('.chip');
  const cards = $$('.card');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      cards.forEach((c) => {
        const t = c.dataset.type;
        c.classList.toggle('is-hidden', !(f === 'all' || t === f));
      });
    });
  });

  /* ---------- mobile nav ---------- */
  const toggle = $('#mobile-toggle');
  const nav = $('.nav');
  const cta = $('.header__cta');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      cta.classList.toggle('is-open', isOpen);
      if (isOpen) {
        nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:#141414;padding:24px;border-bottom:1px solid rgba(255,255,255,0.08);gap:18px';
        cta.style.cssText = nav.style.cssText.replace('display:flex;', 'display:flex;flex-direction:row;') + ';top:auto;margin-top:0;';
      } else {
        nav.style.cssText = '';
        cta.style.cssText = '';
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = $$('.services__head, .grid, .section-head, .cta-band__inner, .stats__grid, .footer__grid');
  revealEls.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }
  // Safety net: force-reveal any remaining elements after 3s
  setTimeout(() => revealEls.forEach((el) => el.classList.add('is-in')), 3000);

  /* ---------- count up stats ---------- */
  const counters = $$('[data-count]');
  let counted = false;
  function runCounters() {
    if (counted) return;
    const statsSection = $('.stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      counted = true;
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const isFloat = !Number.isInteger(target);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  }
  window.addEventListener('scroll', runCounters, { passive: true });
  runCounters();

  /* ---------- subtle parallax on hero panel ---------- */
  const panel = $('.hero__panel');
  if (panel && window.matchMedia('(min-width: 900px)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      panel.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();
