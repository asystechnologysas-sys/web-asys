import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase para ASYS Technology S.A.S.
// Reemplaza estas variables con las credenciales de tu proyecto de Supabase
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY';

export const isSupabaseConfigured = SUPABASE_URL.includes('supabase.co') && !SUPABASE_URL.includes('TU-PROYECTO');

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Guarda una nueva solicitud de contacto en la tabla 'leads' de Supabase
 */
export async function saveContactLead(leadData) {
  const payload = {
    nombre: leadData.name,
    email: leadData.email,
    telefono: leadData.phone,
    servicio_interes: leadData.service,
    detalles_proceso: leadData.message,
    fecha_creacion: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('leads')
      .insert([payload]);

    if (error) {
      console.error('Error insertando en Supabase:', error);
      throw error;
    }
    return { success: true, data };
  } else {
    // Si aún no ha colocado las llaves reales, simular recepción limpia y mostrar cómo configurar
    console.log('📌 [ASYS Lead Capturado en Frontend]:', payload);
    return { success: true, isDemo: true, payload };
  }
}
