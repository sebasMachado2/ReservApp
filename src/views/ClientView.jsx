import React, { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Clipboard, Send } from 'lucide-react';

export const ClientDashboard = ({ user }) => {
  const { appointments, addAppointment, loading } = useAppointments(user);
  const [form, setForm] = useState({ treatment: '', date: '', time: '' });
  const [status, setStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchProfileAndTreatments = async () => {
      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (prof) setProfile(prof);

      const { data: treats } = await supabase.from('treatments').select('*').order('name');
      if (treats) setTreatments(treats);
    };
    fetchProfileAndTreatments();
  }, [user]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.time) return setStatus({ type: 'error', text: 'Por favor selecciona un horario' });
    
    const selectedTreat = treatments.find(t => t.name === form.treatment);

    const res = await addAppointment({
      client_name: profile?.full_name || user.email,
      duration_minutes: selectedTreat?.duration_minutes || 60,
      ...form
    });

    if (res.success) {
      setStatus({ type: 'success', text: '¡Cita solicitada con éxito! Espera la confirmación del dentista.' });
      setForm({ treatment: '', date: '', time: '' });
    } else {
      setStatus({ type: 'error', text: res.message });
    }
  };

  const isTimeOccupied = (time) => {
    const selectedTreat = treatments.find(t => t.name === form.treatment);
    const durationNew = selectedTreat?.duration_minutes || 60;
    
    const startNew = new Date(`1970-01-01T${time}`).getTime();
    const endNew = startNew + (durationNew * 60000);

    return appointments.some(app => {
      if (app.date !== form.date || app.status === 'cancelled') return false;
      
      const startExisting = new Date(`1970-01-01T${app.time}`).getTime();
      const endExisting = startExisting + (app.duration_minutes * 60000);
      
      return startNew < endExisting && startExisting < endNew;
    });
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
      <div className="card glass" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '0.8rem', background: 'var(--primary)', borderRadius: '1rem', color: 'white' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Nueva Cita</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Agenda tu próxima visita</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Paciente</label>
            <input 
              readOnly
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd', background: '#f8fafc', color: 'var(--text-muted)' }}
              value={profile?.full_name || 'Cargando nombre...'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tratamiento</label>
            <select 
              required
              className="input"
              value={form.treatment}
              onChange={e => setForm({ ...form, treatment: e.target.value })}
            >
              <option value="">Selecciona un servicio</option>
              {treatments.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.duration_minutes} min)</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fecha</label>
            <input 
              required
              type="date"
              className="input"
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value, time: '' })}
            />
          </div>

          {form.date && (
            <div>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>Horarios Disponibles</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {timeSlots.map(time => {
                  const occupied = isTimeOccupied(time);
                  const isSelected = form.time === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={occupied}
                      onClick={() => setForm({ ...form, time })}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: occupied ? '#fee2e2' : (isSelected ? 'var(--primary)' : '#e2e8f0'),
                        background: occupied ? '#fef2f2' : (isSelected ? 'var(--primary)' : 'white'),
                        color: occupied ? '#ef4444' : (isSelected ? 'white' : 'var(--text-main)'),
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: occupied ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      {time}
                      {occupied && <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>Ocupado</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem' }}>
            Solicitar Cita <Send size={20} />
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
            textAlign: 'center'
          }}>
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
};
