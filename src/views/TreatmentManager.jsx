import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Plus, Trash2, Clock, Save } from 'lucide-react';

export const TreatmentManager = ({ user }) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTreat, setNewTreat] = useState({ name: '', duration_minutes: 30 });

  const fetchTreatments = async () => {
    setLoading(true);
    const { data } = await supabase.from('treatments').select('*').order('name');
    if (data) setTreatments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('treatments').insert([newTreat]);
    if (!error) {
      setNewTreat({ name: '', duration_minutes: 30 });
      fetchTreatments();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('treatments').delete().eq('id', id);
    if (!error) fetchTreatments();
  };

  if (user?.email !== 'dentista@reservapp.com') return null;

  return (
    <div className="card glass" style={{ marginTop: '2rem', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={24} color="var(--primary)" />
        <h3 style={{ fontSize: '1.4rem' }}>Configuración de Tratamientos</h3>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          placeholder="Nombre del servicio"
          className="input"
          style={{ flex: 2 }}
          value={newTreat.name}
          onChange={e => setNewTreat({...newTreat, name: e.target.value})}
          required
        />
        <div style={{ position: 'relative', flex: 1 }}>
          <Clock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="number"
            placeholder="Minutos"
            className="input"
            style={{ paddingLeft: '2.5rem' }}
            value={newTreat.duration_minutes}
            onChange={e => setNewTreat({...newTreat, duration_minutes: parseInt(e.target.value)})}
            required
            min="10"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
          <Plus size={20} /> Añadir
        </button>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {treatments.map(t => (
          <div key={t.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            background: 'white', 
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div>
              <span style={{ fontWeight: '600' }}>{t.name}</span>
              <span style={{ marginLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {t.duration_minutes} min
              </span>
            </div>
            <button 
              onClick={() => handleDelete(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
