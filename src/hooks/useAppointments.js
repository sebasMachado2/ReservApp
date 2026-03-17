import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAppointments = (user) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar citas desde Supabase
  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    
    let query = supabase.from('appointments').select('*');
    
    // Si no es el dentista, filtrar solo sus citas
    if (user.email !== 'dentista@reservapp.com') {
      query = query.eq('client_email', user.email);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error) {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const addAppointment = async (newApp) => {
    // 1. Obtener citas del mismo día (no canceladas)
    const { data: dayAppointments } = await supabase
      .from('appointments')
      .select('time, duration_minutes')
      .eq('date', newApp.date)
      .neq('status', 'cancelled');

    // 2. Lógica de traslape (Overlapping)
    const startNew = new Date(`1970-01-01T${newApp.time}`).getTime();
    const endNew = startNew + (newApp.duration_minutes * 60000);

    const hasOverlap = dayAppointments?.some(app => {
      const startExisting = new Date(`1970-01-01T${app.time}`).getTime();
      const endExisting = startExisting + (app.duration_minutes * 60000);
      
      // Hay traslape si (Inicio1 < Fin2) Y (Inicio2 < Fin1)
      return startNew < endExisting && startExisting < endNew;
    });

    if (hasOverlap) {
      return { success: false, message: 'Este tratamiento choca con otra cita ya programada' };
    }

    const { error } = await supabase
      .from('appointments')
      .insert([{ 
        client_name: newApp.client_name,
        client_email: user.email,
        treatment: newApp.treatment,
        duration_minutes: newApp.duration_minutes || 60,
        date: newApp.date,
        time: newApp.time,
        status: 'pending'
      }]);

    if (error) return { success: false, message: error.message };
    
    fetchAppointments();
    return { success: true };
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (!error) {
      fetchAppointments();
    }
  };

  return { appointments, loading, addAppointment, updateStatus };
};
