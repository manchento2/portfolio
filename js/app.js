/**
 * ═══════════════════════════════════════════════════════════
 * PORTFOLIO PROFESIONAL – MARCELO SEBASTIAN MANCHENTO
 * app.js – Vanilla JavaScript (Scroll Spy, WhatsApp Form, UI)
 * ═══════════════════════════════════════════════════════════
 */

'use strict';

// ── 1. CONSTANTES & CONFIGURACIÓN ──
const WHATSAPP_PHONE = '5492664657929'; // Número oficial de Marcelo Manchento

// ── 2. ELEMENTOS DEL DOM ──
const header       = document.getElementById('header');
const navToggle    = document.getElementById('nav-toggle');
const navMenu      = document.getElementById('nav-menu');
const navLinks     = document.querySelectorAll('.nav__link');
const contactForm  = document.getElementById('contact-form');
const toastContainer = document.getElementById('toast-container');

// ── 3. INICIALIZACIÓN ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initScrollSpy();
  initContactForm();
});

// ── 4. NAVBAR SCROLL EFFECT ──
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}

// ── 5. MENÚ MOBILE (HAMBURGUESA) ──
function initMobileMenu() {
  if (!navToggle || !navMenu) return;

  const toggleIcon = navToggle.querySelector('i');

  const openMenu = () => {
    navMenu.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-xmark';
    }
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-bars-staggered';
    }
  };

  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Evitar que clicks dentro del contenedor del menú cierren prematuramente
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Cerrar al hacer click en cualquier link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Cerrar al presionar tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ── 6. SCROLL SPY (INDICADOR DE SECCIÓN ACTIVA) ──
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ── 7. FORMULARIO DE CONTACTO A WHATSAPP ──
function initContactForm() {
  if (!contactForm) return;

  const nameInput    = document.getElementById('contact-name');
  const emailInput   = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const errName    = document.getElementById('err-name');
  const errEmail   = document.getElementById('err-email');
  const errSubject = document.getElementById('err-subject');
  const errMessage = document.getElementById('err-message');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    clearErrors([errName, errEmail, errSubject, errMessage], [nameInput, emailInput, subjectInput, messageInput]);

    let isValid = true;
    const nameVal    = nameInput.value.trim();
    const emailVal   = emailInput.value.trim();
    const subjectVal = subjectInput.value;
    const messageVal = messageInput.value.trim();

    // Validación Nombre
    if (!nameVal || nameVal.length < 2) {
      setError(errName, nameInput, 'Por favor, ingresá tu nombre completo.');
      isValid = false;
    }

    // Validación Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      setError(errEmail, emailInput, 'Ingresá un correo electrónico válido.');
      isValid = false;
    }

    // Validación Proyecto
    if (!subjectVal) {
      setError(errSubject, subjectInput, 'Seleccioná el tipo de proyecto que necesitas.');
      isValid = false;
    }

    // Validación Mensaje
    if (!messageVal || messageVal.length < 6) {
      setError(errMessage, messageInput, 'Contame un poco más sobre tu idea (mínimo 6 caracteres).');
      isValid = false;
    }

    if (!isValid) return;

    // Construcción del mensaje para WhatsApp
    let waMsg = `*¡Hola Marcelo! Te contacto desde tu Portfolio Web:*\n\n`;
    waMsg += `👤 *Nombre:* ${nameVal}\n`;
    waMsg += `📧 *Email:* ${emailVal}\n`;
    waMsg += `💼 *Tipo de Proyecto:* ${subjectVal}\n\n`;
    waMsg += `📝 *Mensaje:*\n${messageVal}\n\n`;
    waMsg += `¿Podríamos conversar para coordinar disponibilidad y presupuesto? ¡Muchas gracias!`;

    const encoded = encodeURIComponent(waMsg);
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

    showToast('success', '¡Redirigiendo a WhatsApp!', 'Abriendo chat con tu mensaje listo para enviar.');

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      contactForm.reset();
    }, 800);
  });
}

function setError(errorSpan, inputElement, message) {
  if (errorSpan) errorSpan.textContent = message;
  if (inputElement) inputElement.classList.add('is-error');
}

function clearErrors(errorSpans, inputElements) {
  errorSpans.forEach(span => { if (span) span.textContent = ''; });
  inputElements.forEach(input => { if (input) input.classList.remove('is-error'); });
}

// ── 8. TOAST NOTIFICATIONS ──
function showToast(type, title, message) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <div style="color: #4ade80; font-size: 1.1rem;">
      <i class="fa-solid fa-circle-check"></i>
    </div>
    <div>
      <strong style="display: block; font-size: 0.9rem;">${escapeHtml(title)}</strong>
      <span style="font-size: 0.78rem; color: #94a3b8;">${escapeHtml(message)}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
