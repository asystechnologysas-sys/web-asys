let overlay;
let iconEl;
let titleEl;
let messageEl;
let closeBtn;

function ensureElements() {
  overlay = document.getElementById('notification-modal');
  iconEl = document.getElementById('notification-icon');
  titleEl = document.getElementById('notification-title');
  messageEl = document.getElementById('notification-message');
  closeBtn = document.getElementById('notification-close');

  if (!overlay || closeBtn.dataset.bound) return;

  closeBtn.addEventListener('click', hideNotification);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideNotification();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      hideNotification();
    }
  });

  closeBtn.dataset.bound = 'true';
}

export function showNotification({ type = 'success', title, message }) {
  ensureElements();
  if (!overlay) return;

  overlay.classList.remove('notification-success', 'notification-error');
  overlay.classList.add(type === 'error' ? 'notification-error' : 'notification-success');

  iconEl.innerHTML = type === 'error'
    ? '<i data-lucide="alert-circle"></i>'
    : '<i data-lucide="check-circle-2"></i>';

  titleEl.textContent = title;
  messageEl.textContent = message;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (window.refreshIcons) {
    window.refreshIcons();
  }
}

export function hideNotification() {
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}
