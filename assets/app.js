/* ============================================================
   PRO DETAILING — «Studio Precision» · интерактив
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     РЕЕСТР БУДУЩИХ ФОТО
     Добавьте файл в assets/images/ и пропишите путь здесь —
     заглушка заменится автоматически. Либо используйте
     data-photo-file прямо на .photo-slot в HTML.
     ------------------------------------------------------------ */
  const PHOTO_ASSETS = {
    'hero-main':              'assets/images/hero-main.webp',
    'himchistka-hero':        'assets/images/himchistka-hero.webp',
    'keramika-hero':          'assets/images/keramika-hero.webp',
    'okleyka-hero':           'assets/images/okleyka-hero.webp',
    'pdr-hero':               'assets/images/pdr-hero.webp',
    'service-himchistka':     'assets/images/service-himchistka.webp',
    'service-keramika':       'assets/images/service-keramika.webp',
    'service-okleyka':        'assets/images/service-okleyka.webp',
    'service-pdr':            'assets/images/service-pdr.webp',
    'before-01':              'assets/images/before-01.webp',
    'after-01':               'assets/images/after-01.webp',
    'before-02':              'assets/images/before-02.webp',
    'after-02':               'assets/images/after-02.webp',
    'gallery-01':             'assets/images/gallery-01.webp',
    'gallery-02':             'assets/images/gallery-02.webp',
    'gallery-03':             'assets/images/gallery-03.webp',
    'gallery-04':             'assets/images/gallery-04.webp',
    'studio-interior':        'assets/images/studio-interior.webp'
  };

  /* ---------- Шапка: состояние при скролле ---------- */
  function initHeaderState() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Мобильное меню ---------- */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-is-open', open);
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) setOpen(false);
    });
  }

  /* ---------- Активный пункт меню ---------- */
  function initActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav] a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) a.classList.add('is-active');
    });
  }

  /* ---------- Плавный скролл с учётом шапки ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: y, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- FAQ-аккордеон ---------- */
  function initFaq() {
    document.querySelectorAll('[data-faq-item]').forEach((item) => {
      const btn = item.querySelector('[data-faq-button]');
      const answer = item.querySelector('[data-faq-answer]');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // режим «один открытый»
        item.parentElement.querySelectorAll('.faq-item.is-open').forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-open');
            other.querySelector('[data-faq-button]')?.setAttribute('aria-expanded', 'false');
            const a = other.querySelector('[data-faq-answer]');
            if (a) a.hidden = true;
          }
        });
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        answer.hidden = isOpen;
      });
    });
  }

  /* ---------- Слайдер «до / после» ---------- */
  function initBeforeAfterSliders() {
    document.querySelectorAll('[data-before-after]').forEach((root) => {
      const range = root.querySelector('[data-before-range]');
      const layer = root.querySelector('[data-before-layer]');
      const divider = root.querySelector('[data-before-divider]');
      if (!range || !layer || !divider) return;

      const apply = (v) => {
        const val = Math.min(100, Math.max(0, Number(v)));
        layer.style.width = val + '%';
        divider.style.left = val + '%';
      };
      range.addEventListener('input', () => apply(range.value));
      apply(range.value);
    });
  }

  /* ---------- Фото-заглушки ---------- */
  function initPhotoSlots() {
    document.querySelectorAll('.photo-slot[data-photo]').forEach((slot) => {
      const key = slot.dataset.photo;
      const file = slot.dataset.photoFile || PHOTO_ASSETS[key];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        img.alt = slot.dataset.photoAlt || '';
        img.className = 'photo-slot__image';
        if (!slot.closest('.hero')) img.loading = 'lazy';
        slot.replaceChildren(img);
        slot.classList.add('photo-slot--loaded');
      };
      img.onerror = () => slot.classList.add('photo-slot--fallback');
      img.src = file;
    });
  }

  /* ---------- Формы записи ---------- */
  function normalizePhone(v) {
    const digits = v.replace(/\D/g, '');
    if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) return '+7' + digits.slice(1);
    if (digits.length === 10) return '+7' + digits;
    return digits.length >= 10 ? '+' + digits : null;
  }

  function initBookingForms() {
    document.querySelectorAll('[data-booking-form]').forEach((form) => {
      const status = form.querySelector('[data-form-status]');
      const submitBtn = form.querySelector('[type="submit"]');

      const say = (msg, ok) => {
        if (!status) return;
        status.textContent = msg;
        status.classList.toggle('is-ok', !!ok);
        status.classList.toggle('is-err', !ok);
      };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitBtn?.disabled) return;

        const name = form.elements.name?.value.trim() || '';
        const phone = normalizePhone(form.elements.phone?.value || '');
        const service = form.elements.service?.value || '';
        const consent = form.elements.consent?.checked;

        if (name.length < 2) return say('Укажите имя (минимум 2 символа).', false);
        if (!phone) return say('Укажите корректный телефон, например +7 900 000-00-00.', false);
        if (!service) return say('Выберите услугу.', false);
        if (!consent) return say('Необходимо согласие на обработку персональных данных.', false);

        const payload = {
          page: form.elements.page?.value || location.pathname,
          name, phone, service,
          comment: form.elements.comment?.value.trim() || ''
        };

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Отправляем…'; }
        say('', true);

        try {
          /* Заготовка под backend: замените на fetch('/api/booking', {...}) */
          await new Promise((r) => setTimeout(r, 700));
          say('Спасибо! Мы свяжемся с вами в рабочее время (10:00–20:00).', true);
          form.reset();
        } catch {
          say('Ошибка отправки. Позвоните нам: +7 (343) 268-61-61.', false);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; }
        }
        void payload;
      });
    });
  }

  /* ---------- Появление блоков при скролле ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- ИНИЦИАЛИЗАЦИЯ ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderState();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initFaq();
    initBeforeAfterSliders();
    initPhotoSlots();
    initBookingForms();
    initReveal();
  });
})();
