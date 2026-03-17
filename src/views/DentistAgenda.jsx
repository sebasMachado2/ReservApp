import React, { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { CalendarGrid } from '../components/CalendarGrid';
import { Calendar as CalendarIcon, X, Check, Save, User, Clock, Clipboard } from 'lucide-react';

export const DentistAgenda = ({ user }) => {
  const { appointments, updateStatus } = useAppointments(user);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const changeWeek = (offset) => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + (offset * 7));
    setCurrentWeekStart(next);
  };

  const handleAppClick = (app) => {
    setSelectedApp(app);
  };

  const handleAction = async (status) => {
    if (!selectedApp) return;
    await updateStatus(selectedApp.id, status);
    setSelectedApp(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', minHeight: '600px' }}>
      {/* Calendario principal */}
      <div className="card glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={22} color="var(--primary)" /> Agenda de la Semana
          </h3>
        </div>
        
        <CalendarGrid 
          isDentist={true}
          appointments={appointments}
          currentWeekStart={currentWeekStart}
          onPrevWeek={() => changeWeek(-1)}
          onNextWeek={() => changeWeek(1)}
          onAppClick={handleAppClick}
        />
      </div>

      {/* Panel de detalles lateral */}
      <div className="card glass" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
        <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem' }}>Detalles de la Cita</h3>

        {selectedApp ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '0.6rem', background: 'var(--primary)', borderRadius: '50%', color: 'white' }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paciente</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedApp.client_name}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarIcon size={12} /> Fecha
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedApp.date}</div>
              </div>
              <div style={{ padding: '0.8rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Hora
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{selectedApp.time}</div>
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clipboard size={14} /> Tratamiento
              </div>
              <div style={{ fontWeight: '600' }}>{selectedApp.treatment}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>
                Duración: {selectedApp.duration_minutes} min
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
              {selectedApp.status === 'pending' && (
                <button 
                  onClick={() => handleAction('confirmed')}
                  className="btn btn-primary" style={{ width: '100%' }}
                >
                  <Check size={18} /> Confirmar Cita
                </button>
              )}
              
              <button 
                onClick={() => handleAction('cancelled')}
                className="btn" 
                style={{ width: '100%', background: '#fef2f2', color: 'var(--error)', border: '1px solid #fee2e2' }}
              >
                <X size={18} /> Cancelar Cita
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <CalendarIcon size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>Selecciona una cita en el calendario para ver detalles, confirmar o cancelar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
