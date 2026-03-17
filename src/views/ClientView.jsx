import React, { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { Calendar as CalendarIcon, Clipboard, Send } from 'lucide-react';

export const ClientDashboard = () => {
  const { addAppointment } = useAppointments();
  const [form, setForm] = useState({ name: '', treatment: '', date: '', time: '' });
  const [status, setStatus] = useState(null);

  const treatments = [
    "Limpieza Dental",
    "Extracción",
    "Ortodoncia (Control)",
    "Resina / Empaste",
    "Consulta General"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addAppointment({
      client_name: form.name,
      treatment: form.treatment,
      date: form.date,
      time: form.time
    });

    if (result.success) {
      setStatus({ type: 'success', text: '¡Solicitud enviada! Espera la confirmación del dentista.' });
      setForm({ name: '', treatment: '', date: '', time: '' });
    } else {
      setStatus({ type: 'error', text: result.message });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card glass" style={{ padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Agenda tu Cita</h3>
          <p style={{ color: 'var(--text-muted)' }}>Selecciona el tratamiento y el horario de tu preferencia.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nombre Completo</label>
            <input 
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tratamiento</label>
            <select 
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
              value={form.treatment}
              onChange={e => setForm({...form, treatment: e.target.value})}
            >
              <option value="">Selecciona uno...</option>
              {treatments.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fecha</label>
              <input 
                required
                type="date"
                style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Hora</label>
              <input 
                required
                type="time"
                style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
                value={form.time}
                onChange={e => setForm({...form, time: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
            <Send size={20} />
            Solicitar Cita
          </button>

          {status && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              background: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {status.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
