import React, { useState, useEffect } from 'react';
import { Search, User, Clipboard, History, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { supabase } from '../lib/supabase';

export const PatientHistory = ({ user }) => {
  const { appointments, loading } = useAppointments(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState({});
  const [expandedPatient, setExpandedPatient] = useState(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      if (user?.email === 'dentista@reservapp.com') {
        const { data } = await supabase.from('profiles').select('*');
        if (data) {
          const profileMap = data.reduce((acc, p) => ({ ...acc, [p.email]: p }), {});
          setProfiles(profileMap);
        }
      }
    };
    fetchProfiles();
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando historiales...</div>;
  
  const patients = appointments.reduce((acc, app) => {
    const email = app.client_email;
    if (!acc[email]) {
      acc[email] = {
        name: app.client_name,
        email: email,
        profile: profiles[email] || null,
        history: []
      };
    }
    acc[email].history.push(app);
    return acc;
  }, {});

  const filteredPatients = Object.values(patients).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card glass" style={{ marginTop: '2rem', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <History size={24} color="var(--primary)" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Seguimiento de Pacientes</h3>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            className="input"
            placeholder="Buscar por nombre..." 
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {filteredPatients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '2px dashed #e2e8f0', borderRadius: 'var(--radius-lg)' }}>
            No se encontraron pacientes con ese nombre.
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.email} className="card" style={{ 
              padding: '0', 
              overflow: 'hidden', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {/* Header del Paciente */}
              <div 
                onClick={() => setExpandedPatient(expandedPatient === patient.email ? null : patient.email)}
                style={{ 
                  padding: '1.25rem 1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: expandedPatient === patient.email ? '#f8fafc' : 'white',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '1rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{patient.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{patient.email}</span>
                      {patient.profile && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Nacimiento: {new Date(patient.profile.birth_date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {expandedPatient === patient.email ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
              </div>
              
              {/* Cuerpo del Historial (Colapsable) */}
              {expandedPatient === patient.email && (
                <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', fontWeight: '700' }}>
                    Cronología de Tratamientos
                  </h5>
                  
                  <div style={{ display: 'grid', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '4px', top: '0', bottom: '0', width: '2px', background: '#f1f5f9' }}></div>
                    
                    {patient.history.sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)).map(app => (
                      <div key={app.id} style={{ position: 'relative' }}>
                        <div style={{ 
                          position: 'absolute', 
                          left: '-22px', 
                          top: '4px', 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: app.status === 'confirmed' ? 'var(--success)' : app.status === 'cancelled' ? 'var(--error)' : 'var(--warning)',
                          border: '2px solid white'
                        }}></div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <span style={{ fontWeight: '700', fontSize: '1rem' }}>{app.treatment}</span>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {new Date(app.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} a las {app.time}
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '1rem',
                            fontWeight: '700',
                            background: app.status === 'confirmed' ? '#f0fdf4' : app.status === 'cancelled' ? '#fef2f2' : '#fffbeb',
                            color: app.status === 'confirmed' ? '#166534' : app.status === 'cancelled' ? '#991b1b' : '#92400e'
                          }}>
                            {app.status === 'confirmed' ? 'Realizado' : app.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                          </span>
                        </div>

                        {app.notes && (
                          <div style={{ 
                            marginTop: '0.75rem', 
                            padding: '1rem', 
                            background: '#f8fafc', 
                            borderRadius: 'var(--radius-md)', 
                            borderLeft: '3px solid #e2e8f0',
                            fontSize: '0.9rem',
                            color: 'var(--text-main)',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap'
                          }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FileText size={12} /> Nota Médica
                            </div>
                            {app.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
