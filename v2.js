import { createIcons, icons } from 'lucide';
import { saveContactLead } from './src/apiClient.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
createIcons({ icons });

const orb = $('.cursor-orb'), dot = $('.cursor-dot');
let mouseX = -100, mouseY = -100, orbX = -100, orbY = -100;
const canHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
if (canHover) {
  document.body.classList.add('has-cursor');
  addEventListener('pointermove', event => { mouseX = event.clientX; mouseY = event.clientY; });
  const follow = () => { orbX += (mouseX - orbX) * .14; orbY += (mouseY - orbY) * .14; orb.style.transform = `translate3d(${orbX}px,${orbY}px,0)`; dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`; requestAnimationFrame(follow); };
  follow();
  $$('a,button,input,select,textarea,.capability,.project-slide').forEach(item => {
    item.addEventListener('pointerenter', () => document.body.classList.add('cursor-active'));
    item.addEventListener('pointerleave', () => document.body.classList.remove('cursor-active'));
  });
}

$$('button,.button,.nav-action,.project-open').forEach(button => button.addEventListener('pointerdown', event => {
  const rect = button.getBoundingClientRect(), ripple = document.createElement('span');
  ripple.className = 'ripple'; ripple.style.left = `${event.clientX - rect.left}px`; ripple.style.top = `${event.clientY - rect.top}px`; button.append(ripple); ripple.addEventListener('animationend', () => ripple.remove());
}));

const menu = $('.menu-button'), nav = $('#nav');
menu.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', open); menu.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`; createIcons({ icons }); });
$$('#nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('is-open')));

$$('.capability').forEach(card => card.addEventListener('click', () => {
  $$('.capability').forEach(item => item.classList.remove('active')); card.classList.add('active');
  const field = $('[name="challenge"]'); field.value = `Me interesa ${$('button', card).dataset.focus}. `;
  $('#diagnostico').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => field.focus(), 550);
}));

const track = $('.project-track'), slides = $$('.project-slide'); let projectIndex = 0, dragStart = null;
const moveCarousel = step => { projectIndex = (projectIndex + step + slides.length) % slides.length; track.style.transform = `translateX(-${projectIndex * 100}%)`; $('.current-project').textContent = String(projectIndex + 1).padStart(2, '0'); };
$('.carousel-next').addEventListener('click', () => moveCarousel(1)); $('.carousel-prev').addEventListener('click', () => moveCarousel(-1));
track.addEventListener('pointerdown', event => { dragStart = event.clientX; track.setPointerCapture(event.pointerId); });
track.addEventListener('pointerup', event => { if (dragStart !== null && Math.abs(event.clientX - dragStart) > 45) moveCarousel(event.clientX < dragStart ? 1 : -1); dragStart = null; });
addEventListener('keydown', event => { if (event.key === 'ArrowRight') moveCarousel(1); if (event.key === 'ArrowLeft') moveCarousel(-1); });

const dialog = $('.project-dialog');
$$('.project-open').forEach(button => button.addEventListener('click', () => { $('h2', dialog).textContent = button.dataset.project; dialog.showModal(); }));
$('.dialog-close').addEventListener('click', () => dialog.close());

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
$$('.reveal').forEach(item => observer.observe(item));
const header = $('.site-header'); addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 20), { passive: true });

async function submitLead(form, fallback) {
  if (!form.reportValidity()) return;
  const feedback = $('.form-feedback', form), submit = $('button[type="submit"]', form), payload = Object.fromEntries(new FormData(form));
  submit.disabled = true; feedback.textContent = 'Enviando…';
  try { await saveContactLead({ ...payload, dataConsent: true }); feedback.textContent = 'Recibimos tu mensaje. Te contactaremos pronto.'; form.reset(); }
  catch { feedback.textContent = fallback; }
  finally { submit.disabled = false; }
}
$('#contact-form').addEventListener('submit', event => { event.preventDefault(); submitLead(event.currentTarget, 'No pudimos enviarlo ahora. Escríbenos por WhatsApp.'); });
$('#diagnostic-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return; $('.form-feedback', form).textContent = 'Tu oportunidad fue registrada. Conversemos para analizarla.'; form.reset(); });
