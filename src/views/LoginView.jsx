import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const LoginView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState(null);
  const { login, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const { error } = await login(email, password);
        if (error) throw error;
      } else {
        // 1. Registro en Auth
        const { data, error: signUpError } = await signUp(email, password, {
          full_name: fullName,
          role: 'client'
        });

        if (signUpError) throw signUpError;

        // 2. Insertar en tabla profiles si el usuario se creó
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              full_name: fullName,
              birth_date: birthDate,
              email: email
            }]);

          if (profileError) throw profileError;
        }

        alert('¡Cuenta creada! Revisa tu correo (si aplica) o intenta entrar.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
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
          {!isLogin && (
            <>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  required
                  placeholder="Nombre Completo"
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <input
                  required
                  type="date"
                  placeholder="Fecha de Nacimiento"
                  style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </div>
            </>
          )}
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

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
              {error}
            </div>
          )}
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};
