/**
 * ==============================================================================
 * NutriVital - Calculadoras de Salud y Nutrición
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú móvil
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  // 2. Banner de Cookies
  initCookieBanner();

  // 3. Calculadoras
  initTDEECalculator();
  initBMICalculator();
  initWaterCalculator();

  // 4. Utilidades de lectura y test
  initReadingProgressBar();
  initFAQAccordion();
  initProteinCalculator();
  initNewsletterForm();
});

function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!cookieBanner) return;

  if (!localStorage.getItem('nutrivital_cookie_consent')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('nutrivital_cookie_consent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('nutrivital_cookie_consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }
}

/* ==============================================================================
   Calculadora de Gasto Energético Total (TDEE) y Tasa Metabólica Basal (TMB)
   Fórmula de Mifflin-St Jeor
   ============================================================================== */
function initTDEECalculator() {
  const form = document.getElementById('tdee-calc-form');
  if (!form) return;

  const genderEl = document.getElementById('calc-gender');
  const ageEl = document.getElementById('calc-age');
  const weightEl = document.getElementById('calc-weight');
  const heightEl = document.getElementById('calc-height');
  const activityEl = document.getElementById('calc-activity');

  const bmrResEl = document.getElementById('res-bmr');
  const tdeeResEl = document.getElementById('res-tdee');
  const deficitResEl = document.getElementById('res-deficit');
  const surplusResEl = document.getElementById('res-surplus');

  function calculate() {
    const gender = genderEl.value; // 'male' o 'female'
    const age = parseFloat(ageEl.value) || 25;
    const weight = parseFloat(weightEl.value) || 70;
    const height = parseFloat(heightEl.value) || 175;
    const activity = parseFloat(activityEl.value) || 1.2;

    // Fórmula Mifflin-St Jeor
    // Hombre: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
    // Mujer: (10 × peso) + (6.25 × altura) - (5 × edad) - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activity;
    const deficit = tdee - 500; // Déficit moderado saludable
    const surplus = tdee + 300; // Superávit moderado para hipertrofia

    if (bmrResEl) bmrResEl.textContent = `${Math.round(bmr)} kcal / día`;
    if (tdeeResEl) tdeeResEl.textContent = `${Math.round(tdee)} kcal / día`;
    if (deficitResEl) deficitResEl.textContent = `${Math.round(deficit)} kcal / día`;
    if (surplusResEl) surplusResEl.textContent = `${Math.round(surplus)} kcal / día`;
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* ==============================================================================
   Calculadora de IMC (Índice de Masa Corporal)
   ============================================================================== */
function initBMICalculator() {
  const form = document.getElementById('bmi-calc-form');
  if (!form) return;

  const weightEl = document.getElementById('bmi-weight');
  const heightEl = document.getElementById('bmi-height');
  const bmiValEl = document.getElementById('bmi-result-value');
  const bmiCatEl = document.getElementById('bmi-result-category');

  function calculateBMI() {
    const w = parseFloat(weightEl.value) || 70;
    const h = (parseFloat(heightEl.value) || 175) / 100; // metros
    if (h <= 0) return;

    const bmi = w / (h * h);
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Bajo peso (Insuficiencia ponderal)";
      color = "#0284c7";
    } else if (bmi < 25) {
      category = "Peso Normal (Saludable)";
      color = "#059669";
    } else if (bmi < 30) {
      category = "Sobrepeso";
      color = "#d97706";
    } else {
      category = "Obesidad";
      color = "#dc2626";
    }

    if (bmiValEl) {
      bmiValEl.textContent = bmi.toFixed(1);
      bmiValEl.style.color = color;
    }
    if (bmiCatEl) {
      bmiCatEl.textContent = category;
      bmiCatEl.style.color = color;
    }
  }

  form.addEventListener('input', calculateBMI);
  calculateBMI();
}

/* ==============================================================================
   Calculadora de Ingesta Diaria de Agua
   ============================================================================== */
function initWaterCalculator() {
  const form = document.getElementById('water-calc-form');
  if (!form) return;

  const weightEl = document.getElementById('water-weight');
  const activityEl = document.getElementById('water-activity');
  const resWaterEl = document.getElementById('res-water-liters');
  const resGlassesEl = document.getElementById('res-water-glasses');

  function calculateWater() {
    const w = parseFloat(weightEl.value) || 70;
    const actMins = parseFloat(activityEl.value) || 30;

    // Regla base: ~35 ml por kg de peso corporal + ~350 ml por cada 30 min de ejercicio
    const baseMl = w * 35;
    const exerciseMl = (actMins / 30) * 350;
    const totalMl = baseMl + exerciseMl;
    const liters = (totalMl / 1000).toFixed(2);
    const glasses = Math.round(totalMl / 250); // vasos de 250ml

    if (resWaterEl) resWaterEl.textContent = `${liters} Litros / día`;
    if (resGlassesEl) resGlassesEl.textContent = `Aprox. ${glasses} vasos de 250 ml`;
  }

  form.addEventListener('input', calculateWater);
  calculateWater();
}

/* ==============================================================================
   Barra de Lectura & Acordeón FAQ
   ============================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ==============================================================================
   Calculadora de Proteínas Diarias Óptimas
   ============================================================================== */
function initProteinCalculator() {
  const form = document.getElementById('protein-calc-form');
  if (!form) return;

  const weightEl = document.getElementById('protein-weight');
  const goalEl = document.getElementById('protein-goal');
  const resGramsEl = document.getElementById('res-protein-grams');
  const resKcalEl = document.getElementById('res-protein-kcal');

  function calculate() {
    const weight = parseFloat(weightEl.value) || 70;
    const factor = parseFloat(goalEl.value) || 1.8;
    const grams = Math.round(weight * factor);
    const kcal = grams * 4;

    if (resGramsEl) resGramsEl.textContent = `${grams} gramos / día`;
    if (resKcalEl) resKcalEl.textContent = `${kcal} kcal procedentes de proteína`;
  }

  form.addEventListener('input', calculate);
  calculate();
}

function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    if (btn && input) {
      btn.textContent = "✓ ¡Suscrito con Éxito!";
      btn.style.background = "#14b8a6";
      input.value = "";
      setTimeout(() => {
        btn.textContent = "Suscribirme Gratis";
        btn.style.background = "#0d9488";
      }, 4000);
    }
  });
}

