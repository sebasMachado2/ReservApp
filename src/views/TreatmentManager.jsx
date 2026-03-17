import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Plus, Trash2, Clock, Briefcase } from 'lucide-react';

export const TreatmentManager = ({ user }) => {
  const [treatments, setTreatments] = useState([]);
  const [newTreat, setNewTreat] = useState({ name: '', duration_minutes: 30 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    const { data } = await supabase.from('treatments').select('*').order('name');
    if (data) setTreatments(data);
  };

  const addTreatment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('treatments').insert([newTreat]);
    if (!error) {
      setNewTreat({ name: '', duration_minutes: 30 });
      fetchTreatments();
    }
    setLoading(false);
  };

  const deleteTreatment = async (id) => {
    const { error } = await supabase.from('treatments').delete().eq('id', id);
    if (!error) fetchTreatments();
  };

  return (
    <div className="card glass" style={{ marginTop: '2rem', padding: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '0.8rem', background: 'var(--primary)', borderRadius: '1rem', color: 'white' }}>
          <Settings size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Configuración de Tratamientos</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Define los servicios y sus duraciones</p>
        </div>
      </div>

      <form onSubmit={addTreatment} style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '3rem',
        background: '#f8fafc',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
            Nombre del Servicio
          </label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              required
              className="input"
              style={{ paddingLeft: '2.8rem', height: '45px' }}
              placeholder="Ej: Limpieza profunda"
              value={newTreat.name}
              onChange={e => setNewTreat({ ...newTreat, name: e.target.value })}
            />
          </div>
        </div>

        <div style={{ width: '150px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
            Duración (min)
          </label>
          <div style={{ position: 'relative' }}>
            <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              required
              type="number"
              className="input"
              style={{ paddingLeft: '2.8rem', height: '45px' }}
              min="5"
              step="5"
              value={newTreat.duration_minutes}
              onChange={e => setNewTreat({ ...newTreat, duration_minutes: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <button disabled={loading} className="btn btn-primary" style={{ padding: '0 2rem', height: '45px', minWidth: '120px' }}>
          <Plus size={20} /> Añadir
        </button>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {treatments.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>{t.name}</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--text-muted)', 
                background: '#f1f5f9', 
                padding: '0.3rem 0.8rem', 
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                <Clock size={14} /> {t.duration_minutes} min
              </div>
            </div>
            <button 
              onClick={() => deleteTreatment(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = '#fef2f2'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {treatments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '2px dashed #e2e8f0', borderRadius: 'var(--radius-lg)' }}>
            No hay tratamientos configurados. Añade el primero arriba.
          </div>
        )}
      </div>
    </div>
  );
};
