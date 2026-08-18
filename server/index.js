import express from 'express';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../data/leads.db');
const PORT = 3000;
const API_SECRET_KEY = process.env.API_SECRET_KEY || '';

function initDatabase() {
  const dbDir = path.dirname(DATABASE_PATH);
  fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(DATABASE_PATH);
  db.pragma('journal_mode = WAL');

  const schemaPath = path.join(__dirname, '../database/schema.sql');
  db.exec(fs.readFileSync(schemaPath, 'utf8'));

  return db;
}

const db = initDatabase();
const app = express();

app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: path.basename(DATABASE_PATH) });
});

app.post('/api/leads', (req, res) => {
  const { name, email, phone, service, message, dataConsent } = req.body || {};

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Nombre y correo son obligatorios.' });
  }

  if (dataConsent !== true) {
    return res.status(400).json({ error: 'Debes autorizar el tratamiento de datos personales para enviar el mensaje.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Correo electrónico inválido.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO leads (nombre, email, telefono, servicio_interes, detalles_proceso)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.trim().toLowerCase(),
      phone?.trim() || null,
      service?.trim() || null,
      message?.trim() || null
    );

    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error guardando lead:', error);
    res.status(500).json({ error: 'No se pudo guardar la solicitud.' });
  }
});

app.get('/api/leads', (req, res) => {
  if (API_SECRET_KEY && req.headers['x-api-key'] !== API_SECRET_KEY) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  try {
    const leads = db
      .prepare('SELECT * FROM leads ORDER BY datetime(fecha_creacion) DESC')
      .all();

    res.json({ success: true, leads });
  } catch (error) {
    console.error('Error consultando leads:', error);
    res.status(500).json({ error: 'No se pudieron consultar los registros.' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`API ASYS escuchando en http://127.0.0.1:${PORT}`);
  console.log(`Base de datos: ${DATABASE_PATH}`);
});
