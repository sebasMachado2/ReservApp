import React from 'react';
import Layout from './components/Layout';
import { DentistDashboard } from './views/DentistView';
import { ClientDashboard } from './views/ClientView';
import { PatientHistory } from './views/PatientHistory';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginView } from './views/LoginView';

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Iniciando...</div>;

  if (!user) {
    return <LoginView />;
  }

  // Determinar rol del metadata o por email para el dentista
  const role = user.user_metadata?.role || (user.email === 'dentista@reservapp.com' ? 'dentist' : 'client');

  return (
    <Layout role={role}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Sesión de: </span>
          <span style={{ fontWeight: '600' }}>{user.email}</span>
        </div>
        <button 
          onClick={logout}
          className="btn" 
          style={{ background: '#fee2e2', color: 'var(--error)' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {role === 'dentist' ? (
        <>
          <DentistDashboard user={user} />
          <PatientHistory user={user} />
        </>
      ) : <ClientDashboard user={user} />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
