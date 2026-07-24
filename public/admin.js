import { createIcons, icons } from 'lucide';

const SERVICE_LABELS = {
  rpa: 'Automatización de Procesos (RPA)',
  legal: 'Automatización Legal (LegalTech)',
  ai: 'Inteligencia Artificial & Agentes IA',
  software: 'Desarrollo de Software a Medida',
  data: 'Gestión Integral de Datos & BI'
};

const STORAGE_KEY = 'asys_admin_api_key';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function getServiceLabel(value) {
  return SERVICE_LABELS[value] || value || '—';
}

function setLoading(isLoading) {
  const refreshBtn = document.getElementById('admin-refresh-btn');
  if (refreshBtn) refreshBtn.disabled = isLoading;
}

function renderStats(leads) {
  const totalEl = document.getElementById('stat-total');
  const todayEl = document.getElementById('stat-today');
  const latestEl = document.getElementById('stat-latest');

  const today = new Date().toDateString();
  const todayCount = leads.filter((lead) => new Date(lead.fecha_creacion).toDateString() === today).length;
  const latest = leads[0];

  if (totalEl) totalEl.textContent = String(leads.length);
  if (todayEl) todayEl.textContent = String(todayCount);
  if (latestEl) latestEl.textContent = latest ? formatDate(latest.fecha_creacion) : '—';
}

function renderTable(leads) {
  const tbody = document.getElementById('admin-leads-body');
  const emptyState = document.getElementById('admin-empty-state');
  const tableWrap = document.getElementById('admin-table-wrap');

  if (!tbody) return;

  if (!leads.length) {
    tbody.innerHTML = '';
    emptyState?.classList.remove('hidden');
    tableWrap?.classList.add('hidden');
    return;
  }

  emptyState?.classList.add('hidden');
  tableWrap?.classList.remove('hidden');

  tbody.innerHTML = leads.map((lead) => `
    <tr>
      <td>
        <div class="admin-lead-name">${escapeHtml(lead.nombre)}</div>
        <div class="admin-lead-meta">${escapeHtml(lead.email)}</div>
      </td>
      <td>${escapeHtml(lead.telefono || '—')}</td>
      <td><span class="admin-service-pill">${escapeHtml(getServiceLabel(lead.servicio_interes))}</span></td>
      <td class="admin-message-cell">${escapeHtml(lead.detalles_proceso || '—')}</td>
      <td>${escapeHtml(formatDate(lead.fecha_creacion))}</td>
    </tr>
  `).join('');
}

function showError(message) {
  const errorBox = document.getElementById('admin-error');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function hideError() {
  const errorBox = document.getElementById('admin-error');
  errorBox?.classList.add('hidden');
}

async function fetchLeads(apiKey) {
  hideError();
  setLoading(true);

  try {
    const response = await fetch('/api/leads', {
      headers: { 'x-api-key': apiKey }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'No se pudieron cargar los registros.');
    }

    const leads = data.leads || [];
    renderStats(leads);
    renderTable(leads);
  } catch (error) {
    showError(error.message);
    renderStats([]);
    renderTable([]);
  } finally {
    setLoading(false);
  }
}

function showDashboard(apiKey) {
  document.getElementById('admin-login')?.classList.add('hidden');
  document.getElementById('admin-dashboard')?.classList.remove('hidden');
  document.getElementById('admin-logout-btn')?.classList.remove('hidden');
  fetchLeads(apiKey);
}

function showLogin() {
  document.getElementById('admin-login')?.classList.remove('hidden');
  document.getElementById('admin-dashboard')?.classList.add('hidden');
  document.getElementById('admin-logout-btn')?.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  const loginForm = document.getElementById('admin-login-form');
  const refreshBtn = document.getElementById('admin-refresh-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const savedKey = sessionStorage.getItem(STORAGE_KEY);

  if (savedKey) {
    showDashboard(savedKey);
  } else {
    showLogin();
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiKey = document.getElementById('admin-api-key')?.value.trim();
    if (!apiKey) return;

    sessionStorage.setItem(STORAGE_KEY, apiKey);
    showDashboard(apiKey);
  });

  refreshBtn?.addEventListener('click', () => {
    const apiKey = sessionStorage.getItem(STORAGE_KEY);
    if (apiKey) fetchLeads(apiKey);
  });

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEY);
    showLogin();
  });
});
