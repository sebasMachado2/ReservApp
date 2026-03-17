import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { DentistDashboard } from './views/DentistView';
import { ClientDashboard } from './views/ClientView';
import { PatientHistory } from './views/PatientHistory';
import { TreatmentManager } from './views/TreatmentManager';
import { DentistAgenda } from './views/DentistAgenda';
import { ClientAppointments } from './views/ClientAppointments';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginView } from './views/LoginView';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [profileName, setProfileName] = useState('');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (user) {
      const isDentist = user.email === 'dentista@reservapp.com';
      if (isDentist) {
        setProfileName('Dentista');
        if (!activeTab || activeTab === 'home') setActiveTab('dash');
      } else {
        const fetchProfile = async () => {
          const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
          if (data) setProfileName(data.full_name);
        };
        fetchProfile();
        if (!activeTab || activeTab === 'dash') setActiveTab('home');
      }
    }
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Iniciando...</div>;

  if (!user) {
    return <LoginView />;
  }

  const role = user.user_metadata?.role || (user.email === 'dentista@reservapp.com' ? 'dentist' : 'client');

  const renderContent = () => {
    if (role === 'dentist') {
      switch (activeTab) {
        case 'dash': return <DentistDashboard user={user} />;
        case 'agenda': return <DentistAgenda user={user} />;
        case 'pacientes': return <PatientHistory user={user} />;
        case 'treatments': return <TreatmentManager user={user} />;
        default: return <DentistDashboard user={user} />;
      }
    } else {
      switch (activeTab) {
        case 'home': return <ClientDashboard user={user} />;
        case 'citas': return <ClientAppointments user={user} />;
        default: return <ClientDashboard user={user} />;
      }
    }
  };

  return (
    <Layout 
      role={role} 
      userName={profileName} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Sesión de: </span>
          <span style={{ fontWeight: '600' }}>{profileName || user.email}</span>
        </div>
        <button 
          onClick={logout}
          className="btn" 
          style={{ background: '#fee2e2', color: 'var(--error)' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {renderContent()}
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
