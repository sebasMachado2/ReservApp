import React, { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { Plus, Check, X, Clock } from 'lucide-react';

export const DentistDashboard = ({ user }) => {
  const { appointments, updateStatus, loading } = useAppointments(user);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando agenda...</div>;

  const pending = appointments.filter(app => app.status === 'pending');
  const confirmed = appointments.filter(app => app.status === 'confirmed');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
      {/* Columna de Solicitudes */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Clock className="text-muted" />
          <h3 style={{ fontSize: '1.25rem' }}>Solicitudes Pendientes ({pending.length})</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pending.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)' }}>No hay solicitudes nuevas</p>
            </div>
          ) : (
            pending.map(app => (
              <div key={app.id} className="card glass" style={{ borderLeft: '4px solid var(--warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{app.client_name}</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>{app.treatment}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} /> {app.time} | <span style={{ opacity: 0.5 }}>•</span> {app.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => updateStatus(app.id, 'confirmed')}
                      className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.5rem' }}
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'cancelled')}
                      className="btn" style={{ background: 'var(--error)', color: 'white', padding: '0.5rem' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Columna de Agenda Confirmada */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Check className="text-muted" />
          <h3 style={{ fontSize: '1.25rem' }}>Próximas Citas ({confirmed.length})</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {confirmed.map(app => (
            <div key={app.id} className="card" style={{ borderLeft: '4px solid var(--success)' }}>
              <h4 style={{ marginBottom: '0.25rem' }}>{app.client_name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{app.treatment}</p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '700' }}>{app.time}</span>
                <span style={{ color: 'var(--text-muted)' }}>{app.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
