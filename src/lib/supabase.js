import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rljggmysvwpiqksarmsg.supabase.co';
const supabaseKey = 'sb_publishable_QHXMvsiq7jUTKu5ZsW28zQ_d8lW-2bW';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Definición de tipos de datos para referencia
/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} client_name
 * @property {string} date
 * @property {string} time
 * @property {string} treatment
 * @property {'pending' | 'confirmed' | 'cancelled'} status
 * @property {string} created_at
 */
