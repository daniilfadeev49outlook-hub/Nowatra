// ⚙️ Укажите URL вашего Google Apps Script Web App
const GOOGLE_SHEET_URL = ''; // например, 'https://script.google.com/macros/s/.../exec'

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

  // MODALS
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

  // Функция отправки в Google Таблицу
  async function sendToSheet(formData) {
    if (!GOOGLE_SHEET_URL) return null; // если не настроено – просто вернём успех
    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: formData
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // FORMS
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      let allChecked = true;
      checkboxes.forEach(cb => { if (!cb.checked) allChecked = false; });
      if (!allChecked) {
        alert('Пожалуйста, дайте согласие на обработку персональных данных.');
        return;
      }

      const formData = new FormData(form);
      const sheetResult = await sendToSheet(formData);

      if (sheetResult === null) {
        // Нет URL – имитация
        alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
      } else if (sheetResult) {
        alert('Заявка успешно отправлена! Мы скоро свяжемся с вами.');
      } else {
        alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону +7 (495) 123-45-67.');
      }
      form.reset();
    });
  });

  // PORTFOLIO FILTERS
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');
  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
// Плавающая кнопка – открытие быстрой заявки
const floatingCta = document.getElementById('floatingCta');
const quickFormModal = document.getElementById('quickFormModal');
if (floatingCta && quickFormModal) {
  floatingCta.addEventListener('click', () => {
    quickFormModal.classList.add('active');
  });
}

// Обработка быстрой формы (так же, как основных, с Google Sheets)
const quickForm = document.getElementById('quickForm');
if (quickForm) {
  quickForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checkbox = quickForm.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) {
      alert('Пожалуйста, дайте согласие на обработку персональных данных.');
      return;
    }
    const formData = new FormData(quickForm);
    const sheetResult = await sendToSheet(formData);

    if (sheetResult === null) {
      alert('Спасибо! Заявка принята. Мы свяжемся с вами.');
    } else if (sheetResult) {
      alert('Заявка успешно отправлена! Ожидайте звонка.');
    } else {
      alert('Ошибка отправки. Позвоните нам +7 (495) 123-45-67.');
    }
    quickForm.reset();
    quickFormModal.classList.remove('active');
  });
}
  // GSAP REVEAL
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // PARALLAX SHAPES
  gsap.utils.toArray('.shape').forEach((shape, i) => {
    gsap.to(shape, {
      y: -30 + i * 10,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

});