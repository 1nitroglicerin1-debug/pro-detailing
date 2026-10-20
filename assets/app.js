/* ============================================================
   PRO-DETAILING · Shared JS
   ============================================================ */
const CFG = {
  phone: '+7 (343) 268-61-61',
  phoneLink: '+73432686161',
  mobile: '+7 (952) 727-06-66',
  waLink: 'https://wa.me/79527270666',
  tgLink: 'https://t.me/pro_detailing_ekb'
};

const UNS = 'https://images.unsplash.com/';
const IMG = function(id, w){ return `${UNS}${id}?auto=format&fit=crop&w=${w||1600}&q=80`; };

/* ---- mobile nav ---- */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

/* ---- hero photo fallback (onerror -> gradient) ---- */
document.querySelectorAll('.hero-bg').forEach(el => {
  el.style.backgroundImage = `linear-gradient(120deg,var(--bg2),var(--bg)), url("${el.dataset.bg}")`;
});

/* ---- scroll reveal ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---- counters ---- */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  let cur = 0;
  const step = Math.max(1, Math.round(target / 60));
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = cur.toLocaleString('ru-RU');
  }, 24);
}
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ============================================================
   QUIZ (renders into #quiz-body when present)
   ============================================================ */
const SERVICES = [
  {icon:'🛡️', name:'Антигравийные плёнки и винил', base: 35000},
  {icon:'✨', name:'Полировка и нанокерамика', base: 25000},
  {icon:'🧼', name:'Детейлинг-химчистка салона', base: 8000},
  {icon:'🔧', name:'Удаление вмятин (PDR)', base: 3000},
  {icon:'🪟', name:'Ремонт стёкол и тонировка', base: 5000},
  {icon:'🔇', name:'Шумоизоляция автомобиля', base: 20000},
  {icon:'🚀', name:'Предпродажная подготовка', base: 15000}
];
const BRANDS = [
  {name:'Lada / Kia / Hyundai / Renault', cat:'Эконом', coef:1.0},
  {name:'Toyota / Mazda / Nissan / VW', cat:'Средний', coef:1.2},
  {name:'BMW / Mercedes / Audi / Lexus', cat:'Премиум', coef:1.5},
  {name:'Внедорожник / кроссовер / люкс', cat:'Premium+', coef:1.6}
];
const AREAS = [
  {label:'Частично / отдельные зоны', factor:0.4},
  {label:'Половина (перед или зад)', factor:0.6},
  {label:'Полностью / весь кузов или салон', factor:1.0}
];
const OPTIONS = [
  {id:'ceramic', name:'Доп. защита нанокерамикой', price:12000},
  {id:'glass', name:'Тонировка стёкол', price:6000},
  {id:'rims', name:'Защита колёсных дисков', price:4000},
  {id:'interior', name:'Ароматизация салона', price:1500}
];
const steps = [
  {title:'Какой у вас автомобиль?', sub:'От марки зависит сложность и расход материалов', type:'brand'},
  {title:'Какая услуга интересует?', sub:'Можно выбрать одну — предложим точный расчёт', type:'service'},
  {title:'Какой объём работ?', sub:'Частично или полностью', type:'area'},
  {title:'Добавить опции?', sub:'Опционально — можно пропустить', type:'options', optional:true},
  {title:'Куда отправить расчёт?', sub:'Перезвоним и подтвердим стоимость', type:'contact'}
];
const TOTAL_STEPS = steps.length;
const state = { step:0, brand:null, service:null, area:null, options:[], name:'', phone:'' };

const quizBody = document.getElementById('quiz-body');
if (quizBody) {
  renderQuiz();
}

function renderQuiz() {
  const step = steps[state.step];
  const progress = Math.round((state.step / TOTAL_STEPS) * 100);
  let html = `
    <div class="quiz-progress">
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <span class="progress-num">${state.step + 1}/${TOTAL_STEPS}</span>
    </div>
    <div class="quiz-step active">
      <div class="step-title">${step.title}</div>
      <div class="step-sub">${step.sub}</div>`;
  if (step.type === 'brand') {
    html += `<div class="choices">` + BRANDS.map((b,i)=>`
      <button class="choice ${state.brand===i?'selected':''}" data-idx="${i}" data-act="brand">
        <span class="ico">🚗</span><span class="lbl">${b.name}</span><span class="pric">${b.cat}</span><span class="check"></span></button>`).join('') + `</div>`;
  } else if (step.type === 'service') {
    html += `<div class="choices">` + SERVICES.map((s,i)=>`
      <button class="choice ${state.service===i?'selected':''}" data-idx="${i}" data-act="service">
        <span class="ico">${s.icon}</span><span class="lbl">${s.name}</span><span class="pric">от ${s.base.toLocaleString('ru-RU')} ₽</span><span class="check"></span></button>`).join('') + `</div>`;
  } else if (step.type === 'area') {
    html += `<div class="choices cols-1">` + AREAS.map((a,i)=>`
      <button class="choice ${state.area===i?'selected':''}" data-idx="${i}" data-act="area">
        <span class="lbl">${a.label}</span><span class="check"></span></button>`).join('') + `</div>`;
  } else if (step.type === 'options') {
    html += `<div class="choices cols-1">` + OPTIONS.map((o,i)=>{
      const on = state.options.indexOf(i) > -1;
      return `<button class="choice ${on?'selected':''}" data-idx="${i}" data-act="option">
        <span class="lbl">${o.name}</span><span class="pric">+${o.price.toLocaleString('ru-RU')} ₽</span><span class="check"></span></button>`;
    }).join('') + `</div>`;
  } else if (step.type === 'contact') {
    const total = calcTotal();
    html += renderResult(total) +
      `<div class="field"><label>Ваше имя</label><input class="input" id="inp-name" placeholder="Как к вам обращаться" value="${esc(state.name)}"></div>
       <div class="field"><label>Телефон для связи</label><input class="input" id="inp-phone" placeholder="+7 (___) ___-__-__" inputmode="tel" value="${esc(state.phone)}"></div>`;
  }
  html += `
      <div class="quiz-nav">
        ${state.step > 0 ? '<button class="quiz-back" id="quiz-back">← Назад</button>' : '<span></span>'}
        ${step.type === 'contact'
          ? '<button class="btn btn-primary" id="quiz-submit" disabled style="opacity:.45">Получить расчёт и скидку</button>'
          : `<button class="btn btn-primary" id="quiz-next" ${isStepSelected()?'':'disabled style="opacity:.45;cursor:not-allowed"'}>Далее →</button>`}
      </div></div>`;
  quizBody.innerHTML = html;
  bindQuiz();
}

function renderResult(total) {
  const b = BRANDS[state.brand], s = SERVICES[state.service], a = AREAS[state.area];
  const optsText = state.options.map(i => '· ' + OPTIONS[i].name).join('<br>');
  return `
    <div class="result-panel">
      <div style="font-size:13px;color:var(--muted);margin-bottom:6px">Примерная стоимость</div>
      <div class="result-total">${total.low.toLocaleString('ru-RU')} – ${total.high.toLocaleString('ru-RU')} ₽</div>
      <div class="result-rows">
        <div class="row"><span>Марка / класс:</span><b>${b ? b.name : ''}</b></div>
        <div class="row"><span>Услуга:</span><b>${s ? s.name : ''}</b></div>
        <div class="row"><span>Объём:</span><b>${a ? a.label : ''}</b></div>
        ${optsText ? `<div class="row"><span>Опции:</span><b>${optsText}</b></div>` : ''}
      </div>
    </div>`;
}

function calcTotal() {
  if (state.brand===null || state.service===null || state.area===null) return {low:0, high:0};
  const b = BRANDS[state.brand], s = SERVICES[state.service], a = AREAS[state.area];
  const opts = state.options.reduce((sum,i)=>sum+OPTIONS[i].price, 0);
  const mid = s.base * b.coef * a.factor + opts;
  return { low: Math.round(mid*0.85/500)*500, high: Math.round(mid*1.15/500)*500 };
}
function isStepSelected() {
  const t = steps[state.step].type;
  if (t==='brand') return state.brand!==null;
  if (t==='service') return state.service!==null;
  if (t==='area') return state.area!==null;
  return true;
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function validPhone(p){ return p.replace(/\D/g,'').length >= 10; }

function bindQuiz() {
  document.querySelectorAll('.choice').forEach(el => {
    el.addEventListener('click', () => {
      const act = el.dataset.act, idx = parseInt(el.dataset.idx, 10);
      if (act==='brand') state.brand = idx;
      else if (act==='service') state.service = idx;
      else if (act==='area') state.area = idx;
      else if (act==='option') {
        const i = state.options.indexOf(idx);
        i > -1 ? state.options.splice(i,1) : state.options.push(idx);
      }
      renderQuiz();
    });
  });
  const back = document.getElementById('quiz-back');
  if (back) back.addEventListener('click', () => { state.step--; renderQuiz(); });
  const next = document.getElementById('quiz-next');
  if (next) next.addEventListener('click', () => { if (isStepSelected()) { state.step++; renderQuiz(); } });
  const inpName = document.getElementById('inp-name');
  const inpPhone = document.getElementById('inp-phone');
  if (inpName) inpName.addEventListener('input', e => { state.name = e.target.value; });
  if (inpPhone) inpPhone.addEventListener('input', e => {
    state.phone = e.target.value;
    updateSubmit();
  });
  const sub = document.getElementById('quiz-submit');
  if (sub) sub.addEventListener('click', submitQuiz);
  updateSubmit();
}
function updateSubmit() {
  const sub = document.getElementById('quiz-submit');
  if (!sub) return;
  const ok = validPhone(state.phone);
  sub.disabled = !ok;
  sub.style.opacity = ok ? '1' : '.45';
  sub.style.cursor = ok ? 'pointer' : 'not-allowed';
}
function submitQuiz() {
  if (!validPhone(state.phone)) return;
  const total = calcTotal();
  const b = BRANDS[state.brand], s = SERVICES[state.service], a = AREAS[state.area];
  const opts = state.options.map(i=>OPTIONS[i].name).join(', ') || 'нет';
  const msg = encodeURIComponent(
    `Здравствуйте! Хочу рассчитать детейлинг в PRO-DETAILING.\n` +
    `Марка/класс: ${b.name}\nУслуга: ${s.name}\nОбъём: ${a.label}\nОпции: ${opts}\n` +
    `Примерная стоимость: ${total.low.toLocaleString('ru-RU')} – ${total.high.toLocaleString('ru-RU')} ₽\n` +
    `Имя: ${state.name || '-'} · Телефон: ${state.phone}\nПрошу зафиксировать скидку за заявку с сайта.`
  );
  const wa = CFG.waLink + '?text=' + msg;
  window.open(wa, '_blank');
  quizBody.innerHTML = `
    <div class="quiz-progress"><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div><span class="progress-num">Готово</span></div>
    <div class="quiz-step active" style="text-align:center;padding-top:30px">
      <div style="font-size:48px;margin-bottom:14px">✅</div>
      <div class="step-title">Заявка сформирована!</div>
      <div class="step-sub" style="margin:12px 0 22px">Мы открыли WhatsApp с готовым сообщением. Нажмите «Отправить» — перезвоним в течение 15 минут.</div>
      <div class="final-actions">
        <a href="${wa}" class="btn btn-wa">WhatsApp</a>
        <a href="${CFG.tgLink}" target="_blank" rel="noopener" class="btn btn-tg">Telegram</a>
        <a href="tel:${CFG.phoneLink}" class="btn btn-ghost btn-call">📞 ${CFG.phone}</a>
      </div>
    </div>`;
}

/* ---- booking form (kontakty) ---- */
const bookForm = document.getElementById('book-form');
if (bookForm) {
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bf-name').value.trim();
    const phone = document.getElementById('bf-phone').value.trim();
    const service = document.getElementById('bf-service').value;
    const msg = encodeURIComponent(
      `Здравствуйте! Хочу записаться в PRO-DETAILING.\n` +
      `Имя: ${name}\nТелефон: ${phone}\nУслуга: ${service}`
    );
    window.open(CFG.waLink + '?text=' + msg, '_blank');
  });
}

/* expose IMG helper for inline usage */
window.IMG = IMG;
