import React from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { Clock, CheckCircle2, XCircle, Calendar as CalendarIcon, Clipboard } from 'lucide-react';

export const ClientAppointments = ({ user }) => {
  const { appointments, loading } = useAppointments(user);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando historial...</div>;

  const now = new Date();
  
  // Separar citas pasadas y futuras (o pendientes)
  const isPast = (dateStr, timeStr) => {
    const appDate = new Date(`${dateStr}T${timeStr}`);
    return appDate < now;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#f0fdf4', color: '#166534', icon: <CheckCircle2 size={16} />, label: 'Confirmada' };
      case 'cancelled': return { bg: '#fef2f2', color: '#991b1b', icon: <XCircle size={16} />, label: 'Cancelada' };
      default: return { bg: '#eff6ff', color: '#1e40af', icon: <Clock size={16} />, label: 'Pendiente' };
    }
  };

  const pastAppointments = appointments.filter(app => isPast(app.date, app.time));
  const upcomingAppointments = appointments.filter(app => !isPast(app.date, app.time));

  const AppointmentList = ({ title, list, emptyMsg }) => (
    <section style={{ marginBottom: '3rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>({list.length})</span>
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {list.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #e2e8f0', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            {emptyMsg}
          </div>
        ) : (
          list.map(app => {
            const style = getStatusStyle(app.status);
            return (
              <div key={app.id} className="card glass" style={{ padding: '1.5rem', borderLeft: `4px solid ${style.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    padding: '0.3rem 0.75rem', 
                    borderRadius: '2rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: style.bg,
                    color: style.color
                  }}>
                    {style.icon} {style.label}
                  </div>
                </div>

                <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{app.treatment}</div>
                
                <div style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon size={14} /> {new Date(app.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} /> {app.time} hrs ({app.duration_minutes} min)
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );

  return (
    <div style={{ padding: '1rem' }}>
      <AppointmentList 
        title="Próximas Citas" 
        list={upcomingAppointments} 
        emptyMsg="No tienes citas próximas agendadas."
      />
      
      <div style={{ height: '1px', background: '#e2e8f0', margin: '2rem 0' }}></div>

      <AppointmentList 
        title="Historial de Citas" 
        list={pastAppointments} 
        emptyMsg="Todavía no tienes un historial de citas."
      />
    </div>
  );
};
