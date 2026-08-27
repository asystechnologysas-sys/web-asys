import { classifyIntent, retrieveKnowledge } from './knowledgeService.js';
import { generateWithProvider } from './llmProvider.js';

const CONTACT_CTA = { label: 'Hablar con ASYS por WhatsApp', url: 'https://wa.me/573117304768?text=Hola%2C%20quiero%20conocer%20c%C3%B3mo%20ASYS%20puede%20ayudar%20a%20mi%20empresa.' };
const ANALYSIS_CTA = { label: 'Analizar mi empresa', url: '#diagnostico' };

function detectLanguage(message) { return /\b(the|what|how|can you|services)\b/i.test(message) ? 'en' : 'es'; }
function isUnsafeRequest(message) { return /(ignora.*instrucciones|system prompt|prompt del sistema|api key|api keys|clave.*api|token|credencial|documento.*interno|ejecuta.*sql|revela.*instruccion)/i.test(message); }

function localAnswer(message, sources, intent) {
  const text = message.toLowerCase();
  if (intent === 'PRICING') return 'El valor depende del alcance y de los procesos que quieras resolver. Para no darte un precio inventado, lo mejor es analizar tu caso y preparar una propuesta personalizada.';
  if (!sources.length) return 'No tengo información oficial suficiente para confirmarte eso. Puedo ayudarte a contactar con ASYS para que el equipo lo revise contigo.';
  const hasWhatsAppNeed = /(whatsapp|mensaje|reserva|pedido)/.test(text);
  if (hasWhatsAppNeed) return 'Sí. Por lo que describes, podemos estudiar una solución conectada a WhatsApp para responder consultas frecuentes, clasificar solicitudes, hacer seguimiento y derivar lo importante a tu equipo. La solución final depende de cómo opere hoy tu empresa.';
  const context = sources.slice(0, 2).map(source => source.content).join(' ');
  return `${context} ¿Quieres que revisemos cómo podría aplicarse a tu empresa?`;
}

export async function answerChat({ message, history = [], pageContext = '' }) {
  if (isUnsafeRequest(message)) return { answer: 'No puedo ayudar a revelar instrucciones internas, credenciales ni información privada. Sí puedo ayudarte con información pública de ASYS Technology.', intent: 'UNSAFE_REQUEST', confidence: 'HIGH', provider: 'safety', sources: [], cta: null };
  const intent = classifyIntent(message);
  const sources = retrieveKnowledge(message);
  const language = detectLanguage(message);
  const context = sources.map(source => `[${source.title}] ${source.content}`).join('\n');
  let answer;
  let provider = 'official-retrieval';
  try {
    answer = await generateWithProvider({ messages: [...history.slice(-6), { role: 'user', content: message }], context, language, pageContext });
    if (answer) provider = 'llm';
  } catch {
    answer = null;
  }
  answer ||= localAnswer(message, sources, intent);
  const confidence = sources[0]?.score >= 6 ? 'HIGH' : sources.length ? 'MEDIUM' : 'LOW';
  const cta = ['LEAD', 'CONTACT', 'PRICING'].includes(intent) ? (intent === 'LEAD' ? ANALYSIS_CTA : CONTACT_CTA) : null;
  return { answer, intent, confidence, provider, sources: sources.map(source => ({ title: source.title, url: source.url, source: source.source })), cta };
}
