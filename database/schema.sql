CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  servicio_interes TEXT,
  detalles_proceso TEXT,
  fecha_creacion TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_fecha ON leads (fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
