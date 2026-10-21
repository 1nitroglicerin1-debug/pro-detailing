/* ============================================================
   PRO Detailing — интерактив
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Шапка: состояние при скролле ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  const burger = document.querySelector('.burger');
  const mobile = document.querySelector('.mobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      mobile.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.classList.remove('is-open');
        mobile.classList.remove('is-open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- Появление при скролле ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- FAQ (аккордеон) ---------- */
  document.querySelectorAll('.faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const ans = item.querySelector('.faq__a');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item.is-open').forEach(o => {
        o.classList.remove('is-open');
        o.querySelector('.faq__a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('is-open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Формы: отправка + toast ---------- */
  const toast = document.getElementById('toast');
  function showToast(msg, ok) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('is-ok', 'is-err');
    toast.classList.add(ok ? 'is-ok' : 'is-err', 'is-show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-show'), 3200);
  }

  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const service = form.querySelector('[name="service"]');

      if (phone && phone.value.replace(/\D/g, '').length < 10) {
        showToast('Укажите корректный номер телефона', false);
        phone.focus();
        return;
      }

      if (btn) {
        btn.dataset.orig = btn.textContent;
        btn.textContent = 'Отправляем…';
        btn.disabled = true;
      }

      const payload = {
        name: name ? name.value : '',
        phone: phone ? phone.value : '',
        service: service ? service.value : (form.dataset.form || ''),
        page: location.pathname.split('/').pop() || 'index.html',
        ts: new Date().toISOString()
      };

      // Демо-отправка (подключите реальный endpoint/Telegram-бота)
      setTimeout(() => {
        if (btn) { btn.textContent = btn.dataset.orig; btn.disabled = false; }
        showToast('Заявка отправлена! Свяжемся с вами в течение 15 минут', true);
        form.reset();
        console.info('[PRO Detailing] Заявка:', payload);
      }, 700);
    });
  });

  /* ---------- Маска телефона ---------- */
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', () => {
      let d = inp.value.replace(/\D/g, '').slice(0, 11);
      if (d.startsWith('8')) d = '7' + d.slice(1);
      const start = d.startsWith('7') ? '7' : '';
      const rest = start ? d.slice(1) : d;
      let out = start ? '+7' : '';
      if (rest.length) out += ' (' + rest.slice(0, 3);
      if (rest.length >= 4) out += ') ' + rest.slice(3, 6);
      if (rest.length >= 7) out += '-' + rest.slice(6, 8);
      if (rest.length >= 9) out += '-' + rest.slice(8, 10);
      inp.value = out;
    });
  });

  /* ---------- Текущий пункт меню ---------- */
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__link').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
    if (href === current || (current === '' && href === 'index.html')) a.classList.add('is-active');
  });
})();

/* ---------- Слайдер «До / После» ---------- */
(function () {
  const slider = document.getElementById('baSlider');
  if (!slider) return;
  const after = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;
  const setPos = (clientX) => {
    const r = slider.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
    handle.style.left = p + '%';
  };
  slider.addEventListener('pointerdown', (e) => { dragging = true; slider.setPointerCapture(e.pointerId); setPos(e.clientX); });
  slider.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
  slider.addEventListener('pointerup', () => { dragging = false; });
  after.style.clipPath = 'inset(0 0 0 50%)';
})();
