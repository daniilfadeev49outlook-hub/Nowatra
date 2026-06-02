const GOOGLE_SHEET_URL = ''; // ваш URL при необходимости

document.addEventListener('DOMContentLoaded', () => {

  // BURGER
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      burger.classList.toggle('active');
    });
  }

  // COOKIE
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  if (cookieBanner && acceptBtn) {
    if (!localStorage.getItem('cookiesAccepted')) cookieBanner.style.display = 'flex';
    else cookieBanner.style.display = 'none';
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // MODALS (все)
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal + 'Modal');
      if (modal) modal.classList.add('active');
    });
  });
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  });

  // Функция отправки в Google Sheets
  async function sendToSheet(formData) {
    if (!GOOGLE_SHEET_URL) return null;
    try {
      const response = await fetch(GOOGLE_SHEET_URL, { method: 'POST', body: formData });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  // Универсальная обработка форм (все, кроме калькулятора, exit, чата — они отдельно)
  document.querySelectorAll('form:not(#calcForm):not(#exitForm):not(#chatForm)').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length && ![...checkboxes].every(cb => cb.checked)) {
        alert('Пожалуйста, дайте согласие на обработку персональных данных.');
        return;
      }
      const data = new FormData(form);
      const res = await sendToSheet(data);
      alert(res === null ? 'Спасибо! Заявка принята.' : (res ? 'Отправлено!' : 'Ошибка. Позвоните нам.'));
      form.reset();
    });
  });

  // ТАЙМЕР
  function updateTimer() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const diff = end - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }
  if (document.getElementById('timer')) {
    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // КАЛЬКУЛЯТОР
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const area = parseFloat(document.getElementById('calcArea').value);
      if (!area || area < 10) { alert('Введите площадь больше 10 м²'); return; }
      const repair = document.getElementById('calcRepair').value;
      const prices = { cosmetic: [4500, 6000], capital: [12000, 16000], design: [18000, 25000] };
      const [min, max] = prices[repair];
      const range = `${Math.round(area * min).toLocaleString()} – ${Math.round(area * max).toLocaleString()} ₽`;
      document.getElementById('calcPrice').textContent = range;
      document.getElementById('calcResult').style.display = 'block';
    });
  }

  // EXIT INTENT
  const exitPopup = document.getElementById('exitPopup');
  let exitShown = false;
  if (exitPopup) {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown && !sessionStorage.getItem('exitPopupClosed')) {
        exitPopup.classList.add('active');
        exitShown = true;
      }
    });
    exitPopup.querySelector('.modal__close').addEventListener('click', () => {
      exitPopup.classList.remove('active');
      sessionStorage.setItem('exitPopupClosed', '1');
    });
    exitPopup.addEventListener('click', (e) => { if (e.target === exitPopup) exitPopup.classList.remove('active'); });
    document.getElementById('exitForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const cb = e.target.querySelector('input[type="checkbox"]');
      if (!cb.checked) { alert('Дайте согласие'); return; }
      const data = new FormData(e.target);
      const res = await sendToSheet(data);
      alert(res === null ? 'Скидка зафиксирована! Ждите звонка.' : (res ? 'Отправлено!' : 'Ошибка.'));
      e.target.reset();
      exitPopup.classList.remove('active');
      sessionStorage.setItem('exitPopupClosed', '1');
    });
  }

  // ОНЛАЙН-ЧАТ
  const chatFloat = document.getElementById('chatFloat');
  const chatModal = document.getElementById('chatModal');
  if (chatFloat && chatModal) {
    chatFloat.addEventListener('click', () => chatModal.classList.add('active'));
    chatModal.querySelector('.modal__close').addEventListener('click', () => chatModal.classList.remove('active'));
    chatModal.addEventListener('click', (e) => { if (e.target === chatModal) chatModal.classList.remove('active'); });
    document.getElementById('chatForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const cb = e.target.querySelector('input[type="checkbox"]');
      if (!cb.checked) { alert('Дайте согласие'); return; }
      const data = new FormData(e.target);
      const res = await sendToSheet(data);
      alert(res === null ? 'Сообщение отправлено! Мы скоро ответим.' : (res ? 'Отправлено!' : 'Ошибка.'));
      e.target.reset();
      chatModal.classList.remove('active');
    });
  }

  // ПЛАВАЮЩАЯ КНОПКА ЗАЯВКИ
  const floatingCta = document.getElementById('floatingCta');
  const quickFormModal = document.getElementById('quickFormModal'); // если есть
  // (для совместимости с предыдущим кодом, можно оставить заглушку)
  
  // GSAP REVEAL
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
});