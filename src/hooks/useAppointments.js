import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar citas desde Supabase
  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (newApp) => {
    // Verificar conflictos en Supabase
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', newApp.date)
      .eq('time', newApp.time)
      .neq('status', 'cancelled');

    if (conflicts && conflicts.length > 0) {
      return { success: false, message: 'Horario ya ocupado' };
    }

    const { error } = await supabase
      .from('appointments')
      .insert([{ 
        client_name: newApp.client_name,
        treatment: newApp.treatment,
        date: newApp.date,
        time: newApp.time,
        status: 'pending'
      }]);

    if (error) return { success: false, message: error.message };
    
    fetchAppointments(); // Recargar datos
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
