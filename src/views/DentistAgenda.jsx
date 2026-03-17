import React, { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { CalendarGrid } from '../components/CalendarGrid';
import { Calendar as CalendarIcon, X, Check, Save, User, Clock, Clipboard, FileText, Edit2 } from 'lucide-react';

export const DentistAgenda = ({ user }) => {
  const { appointments, updateStatus, updateNotes, rescheduleAppointment } = useAppointments(user);
  const [selectedApp, setSelectedApp] = useState(null);
  const [tempNotes, setTempNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ date: '', time: '' });
  const [saveStatus, setSaveStatus] = useState('');
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // Sincronizar datos cuando cambia la cita seleccionada
  useEffect(() => {
    if (selectedApp) {
      setTempNotes(selectedApp.notes || '');
      setEditForm({ date: selectedApp.date, time: selectedApp.time });
      setIsEditing(false);
      setSaveStatus('');
    }
  }, [selectedApp]);

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

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setSaveStatus('saving_notes');
    await updateNotes(selectedApp.id, tempNotes);
    setSaveStatus('saved_notes');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleReschedule = async () => {
    if (!selectedApp) return;
    setSaveStatus('saving_reschedule');
    const res = await rescheduleAppointment(selectedApp.id, editForm.date, editForm.time);
    if (res.success) {
      setSaveStatus('saved_reschedule');
      setIsEditing(false);
      // Actualizar el selectedApp local para que la UI se refresque
      setSelectedApp({ ...selectedApp, date: editForm.date, time: editForm.time });
      setTimeout(() => setSaveStatus(''), 2000);
    } else {
      setSaveStatus('error');
    }
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
      <div className="card glass" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem' }}>Detalles de la Cita</h3>

        {selectedApp ? (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '0.6rem', background: 'var(--primary)', borderRadius: '50%', color: 'white' }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paciente</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{selectedApp.client_name}</div>
              </div>
            </div>

            {/* Sección de Fecha y Hora (Modificable) */}
            <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Horario Programado</div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600' }}
                  >
                    <Edit2 size={14} /> Modificar
                  </button>
                )}
              </div>

              {isEditing ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <input 
                    type="date" 
                    className="input" 
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  />
                  <input 
                    type="time" 
                    className="input" 
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
                    value={editForm.time}
                    onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={handleReschedule}
                      disabled={saveStatus === 'saving_reschedule'}
                      className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      {saveStatus === 'saving_reschedule' ? 'Guardando...' : 'Confirmar Cambios'}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="btn" style={{ background: 'white', border: '1px solid #ddd', padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fecha</div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{selectedApp.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hora</div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{selectedApp.time}</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clipboard size={14} /> Tratamiento
              </div>
              <div style={{ fontWeight: '600' }}>{selectedApp.treatment}</div>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>

            {/* Sección de Notas */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <FileText size={16} color="var(--primary)" /> Observaciones Clínicas
              </label>
              <textarea 
                className="input"
                style={{ 
                  minHeight: '100px', 
                  resize: 'none', 
                  fontSize: '0.85rem',
                  padding: '0.75rem',
                  lineHeight: '1.4'
                }}
                placeholder="Escribe aquí el progreso o detalles del tratamiento..."
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
              />
              <button 
                onClick={handleSaveNotes}
                disabled={saveStatus === 'saving_notes'}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.75rem', background: saveStatus === 'saved_notes' ? 'var(--success)' : '', padding: '0.6rem' }}
              >
                {saveStatus === 'saving_notes' ? 'Guardando...' : saveStatus === 'saved_notes' ? '¡Guardado!' : (
                  <><Save size={16} /> Guardar Notas</>
                )}
              </button>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '0.25rem 0' }}></div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
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
            <p>Selecciona una cita en el calendario para ver detalles, confirmar o modificar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
