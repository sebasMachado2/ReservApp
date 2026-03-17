import React from 'react';
import { Calendar, Users, Home, ClipboardList, LogOut } from 'lucide-react';

const Layout = ({ children, role = 'client' }) => {
  const navItems = role === 'dentist' 
    ? [
        { icon: <Home size={20} />, label: 'Dashboard', id: 'dash' },
        { icon: <Calendar size={20} />, label: 'Agenda', id: 'agenda' },
        { icon: <Users size={20} />, label: 'Pacientes', id: 'pacientes' },
      ]
    : [
        { icon: <Home size={20} />, label: 'Inicio', id: 'home' },
        { icon: <Calendar size={20} />, label: 'Mis Citas', id: 'citas' },
        { icon: <ClipboardList size={20} />, label: 'Servicios', id: 'servicios' },
      ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '260px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ReservApp <span style={{ color: 'var(--text-main)', WebkitTextFillColor: 'initial', fontSize: '1rem', fontWeight: '400' }}>Dental</span>
          </h1>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <button key={item.id} className="btn" style={{
              justifyContent: 'flex-start',
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '0.75rem 1rem'
            }}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn" style={{ width: '100%', color: 'var(--error)', background: 'transparent' }}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <header style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>
              Hola, Dr. García 👋
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Bienvenido a tu panel de control.</p>
          </div>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '50%', 
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700'
          }}>
            DG
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
