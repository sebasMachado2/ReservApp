import React, { useState } from 'react';
import Layout from './components/Layout';
import { DentistDashboard } from './views/DentistView';
import { ClientDashboard } from './views/ClientView';
import { PatientHistory } from './views/PatientHistory';
import { LoginView } from './views/LoginView';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginView onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <Layout role={user.role}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Sesión de: </span>
          <span style={{ fontWeight: '600' }}>{user.email}</span>
        </div>
        <button 
          onClick={() => setUser(null)}
          className="btn" 
          style={{ background: '#fee2e2', color: 'var(--error)' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {user.role === 'dentist' ? (
        <>
          <DentistDashboard />
          <PatientHistory />
        </>
      ) : <ClientDashboard />}
    </Layout>
  );
}

export default App;
