import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica real de Supabase
    // Por ahora simulamos el login basándonos en un email ficticio
    const role = email.includes('dentista') ? 'dentist' : 'client';
    onLogin({ email, role });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '1rem'
    }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'var(--primary)', 
            borderRadius: '1rem', 
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <LogIn size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            {isLogin ? '¡Bienvenido!' : 'Crea tu cuenta'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a ReservApp Dental'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              required
              type="email"
              placeholder="Correo electrónico"
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              required
              type="password"
              placeholder="Contraseña"
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>
            {isLogin ? 'Entrar' : 'Registrarse'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra aquí'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-md)', border: '1px solid #fef3c7', fontSize: '0.85rem' }}>
          <p style={{ color: '#92400e' }}>
            <strong>Tip para probar:</strong><br />
            - Usa un email con la palabra <b>"dentista"</b> para entrar como tal.<br />
            - Cualquier otro entrará como <b>cliente</b>.
          </p>
        </div>
      </div>
    </div>
  );
};
