import React, { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Send } from 'lucide-react';
import { CalendarGrid } from '../components/CalendarGrid';

export const ClientDashboard = ({ user }) => {
  const { appointments, addAppointment } = useAppointments(user);
  const [form, setForm] = useState({ treatment: '', date: '', time: '' });
  const [status, setStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [treatments, setTreatments] = useState([]);
  
  // Estado para la navegación de semanas
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  useEffect(() => {
    const fetchProfileAndTreatments = async () => {
      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (prof) setProfile(prof);

      const { data: treats } = await supabase.from('treatments').select('*').order('name');
      if (treats) setTreatments(treats);
    };
    fetchProfileAndTreatments();
  }, [user]);

  const changeWeek = (offset) => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + (offset * 7));
    setCurrentWeekStart(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.time || !form.date) return setStatus({ type: 'error', text: 'Por favor selecciona fecha y hora en el calendario' });
    
    const selectedTreat = treatments.find(t => t.name === form.treatment);

    const res = await addAppointment({
      client_name: profile?.full_name || user.email,
      duration_minutes: selectedTreat?.duration_minutes || 60,
      treatment: form.treatment,
      date: form.date,
      time: form.time
    });

    if (res.success) {
      setStatus({ type: 'success', text: '¡Cita solicitada! Revisa el calendario para ver tu bloque reservado.' });
      setForm({ ...form, time: '' });
    } else {
      setStatus({ type: 'error', text: res.message });
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Izquierda: El Calendario Semanal */}
        <div style={{ minWidth: 0 }}>
          <div className="card glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={20} color="var(--primary)" /> Horarios Disponibles
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Haz click en un espacio en blanco para seleccionar fecha y hora en el calendario.
            </p>
            <CalendarGrid 
              appointments={appointments} 
              currentWeekStart={currentWeekStart}
              onPrevWeek={() => changeWeek(-1)}
              onNextWeek={() => changeWeek(1)}
              onSlotClick={(date, time) => setForm({ ...form, date, time })}
              selectedDate={form.date}
              selectedTime={form.time}
            />
          </div>
        </div>

        {/* Derecha: Formulario de Cita */}
        <div className="card glass" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Agendar Cita</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tratamiento</label>
              <select 
                required
                className="input"
                style={{ marginTop: '0.5rem' }}
                value={form.treatment}
                onChange={e => setForm({ ...form, treatment: e.target.value })}
              >
                <option value="">Selecciona servicio...</option>
                {treatments.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.duration_minutes} min)</option>
                ))}
              </select>
            </div>

            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              {form.date && form.time ? (
                <div style={{ fontSize: '0.9rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Seleccionado:</div>
                  <div style={{ fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
                    {new Date(form.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    {form.time} hrs
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                  Selecciona un espacio en el calendario
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', height: 'auto' }}>
              Solicitar Ahora <Send size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          {status && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: status.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {status.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
