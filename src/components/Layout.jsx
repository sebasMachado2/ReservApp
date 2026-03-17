import React from 'react';
import { Calendar, Users, Home, ClipboardList, LogOut } from 'lucide-react';

const Layout = ({ children, role = 'client', userName = '', activeTab, onTabChange }) => {
  const navItems = role === 'dentist' 
    ? [
        { icon: <Home size={20} />, label: 'Dashboard', id: 'dash' },
        { icon: <Calendar size={20} />, label: 'Agenda', id: 'agenda' },
        { icon: <Users size={20} />, label: 'Pacientes', id: 'pacientes' },
        { icon: <ClipboardList size={20} />, label: 'Tratamientos', id: 'treatments' },
      ]
    : [
        { icon: <Home size={20} />, label: 'Inicio', id: 'home' },
        { icon: <Calendar size={20} />, label: 'Mis Citas', id: 'citas' },
      ];

  // Obtener iniciales del nombre
  const initials = userName 
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '260px',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        position: 'fixed',
        height: '100vh'
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
            <button 
              key={item.id} 
              onClick={() => onTabChange?.(item.id)}
              className={`btn ${activeTab === item.id ? 'btn-primary' : ''}`} 
              style={{
                justifyContent: 'flex-start',
                background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--text-muted)',
                padding: '0.75rem 1rem',
                boxShadow: activeTab === item.id ? 'var(--shadow-md)' : 'none'
              }}
            >
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
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', marginLeft: '260px' }}>
        <header style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
              Bienvenido a tu panel de control.
            </p>
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
            {initials}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
