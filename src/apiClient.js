const API_BASE = import.meta.env?.VITE_API_URL || '/api';

export async function saveContactLead(leadData) {
  const payload = {
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    service: leadData.service,
    message: leadData.message,
    dataConsent: leadData.dataConsent
  };

  const response = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'No se pudo registrar la solicitud.');
  }

  return data;
}
