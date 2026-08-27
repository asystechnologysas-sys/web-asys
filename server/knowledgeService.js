import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = process.env.KNOWLEDGE_DIR || path.join(__dirname, '../knowledge');
const STOP_WORDS = new Set(['a', 'al', 'ante', 'bajo', 'con', 'contra', 'de', 'del', 'el', 'en', 'es', 'la', 'las', 'lo', 'los', 'mi', 'o', 'para', 'por', 'que', 'se', 'si', 'su', 'un', 'una', 'unos', 'unas', 'y']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : (entry.name.endsWith('.json') ? [target] : []);
  });
}

function tokenize(value = '') {
  return value.toLocaleLowerCase('es-CO').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .match(/[a-z0-9]{2,}/g)?.filter(token => !STOP_WORDS.has(token)) || [];
}

function chunkDocument(document) {
  const sentences = document.content.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [document.content];
  const chunks = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length > 480 && current) {
      chunks.push({ ...document, content: current.trim() });
      current = '';
    }
    current += `${sentence.trim()} `;
  }
  if (current.trim()) chunks.push({ ...document, content: current.trim() });
  return chunks;
}

let cachedChunks;

export function getKnowledgeChunks() {
  if (cachedChunks) return cachedChunks;
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];
  cachedChunks = walk(KNOWLEDGE_DIR).flatMap(file => {
    try { return chunkDocument(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch { return []; }
  });
  return cachedChunks;
}

export function retrieveKnowledge(query, limit = 4) {
  const terms = tokenize(query);
  if (!terms.length) return [];
  return getKnowledgeChunks().map(chunk => {
    const searchable = tokenize(`${chunk.title} ${chunk.category} ${chunk.content}`);
    const matches = terms.reduce((score, term) => score + searchable.filter(word => word === term || word.startsWith(term)).length, 0);
    return { ...chunk, score: matches * (chunk.priority === 1 ? 1.5 : 1) };
  }).filter(chunk => chunk.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

export function classifyIntent(message = '') {
  const text = message.toLocaleLowerCase('es-CO');
  if (/(precio|cuesta|cotiza|presupuesto)/.test(text)) return 'PRICING';
  if (/(whatsapp|contact|asesor|consultor|hablar)/.test(text)) return 'CONTACT';
  if (/(proyecto|caso|realizado)/.test(text)) return 'PROJECT_INQUIRY';
  if (/(legal|abogado|legaltech)/.test(text)) return 'SERVICE_INQUIRY';
  if (/(automat|empresa|negocio|restaurante|barber|comercio)/.test(text)) return 'LEAD';
  if (/(servicio|software|integraci|inteligencia artificial|ia)/.test(text)) return 'SERVICE_INQUIRY';
  return 'GENERAL_INFORMATION';
}
