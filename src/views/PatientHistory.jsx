import React, { useState, useEffect } from 'react';
import { Search, User, Clipboard, History } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';

export const PatientHistory = () => {
  const { appointments, loading } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (loading) return null;
  
  // Agrupar citas por cliente para crear un "historial"
  const patients = appointments.reduce((acc, app) => {
    if (!acc[app.client_name]) {
      acc[app.client_name] = {
        name: app.client_name,
        history: []
      };
    }
    acc[app.client_name].history.push(app);
    return acc;
  }, {});

  const filteredPatients = Object.values(patients).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.4rem' }}>Historial Clínico (Simulado)</h3>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar paciente..." 
            style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredPatients.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No se encontraron pacientes.</p>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.name} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <User size={20} />
                </div>
                <h4 style={{ fontSize: '1.1rem' }}>{patient.name}</h4>
              </div>
              
              <div style={{ marginLeft: '3rem' }}>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Historial de Tratamientos</h5>
                {patient.history.sort((a,b) => new Date(b.date) - new Date(a.date)).map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <span>{app.treatment}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{app.date}</span>
                    <span style={{ 
                      color: app.status === 'confirmed' ? 'var(--success)' : 
                             app.status === 'cancelled' ? 'var(--error)' : 'var(--warning)',
                      fontWeight: '600'
                    }}>
                      {app.status === 'confirmed' ? 'Realizado' : 
                       app.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
