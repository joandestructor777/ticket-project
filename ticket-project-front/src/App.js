import React from 'react';
import Header from './shared/components/Header';
import SupervisorDashboard from './features/supervisor/components/SupervisorDashboard';
import TechnicianDashboard from './features/technician/components/TechnicianDashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = React.useState('supervisor');

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              {activeTab === 'supervisor' ? 'Panel de Control de SLAs' : 'Portal de Técnicos'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              {activeTab === 'supervisor' ? 'Monitoreo y gestión de tiempos límite (SLA) de tickets de soporte.' : 'Gestión de tickets asignados y flujo de resolución.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span 
              onClick={() => setActiveTab('supervisor')}
              style={{ color: activeTab === 'supervisor' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'supervisor' ? '600' : 'normal', borderBottom: activeTab === 'supervisor' ? '2px solid var(--primary)' : 'none', paddingBottom: '4px', cursor: 'pointer' }}>
              Panel de Supervisor
            </span>
            <span style={{ cursor: 'not-allowed', opacity: 0.5 }}>Portal de Clientes (HU-001)</span>
            <span 
              onClick={() => setActiveTab('technician')}
              style={{ color: activeTab === 'technician' ? 'var(--primary)' : 'inherit', fontWeight: activeTab === 'technician' ? '600' : 'normal', borderBottom: activeTab === 'technician' ? '2px solid var(--primary)' : 'none', paddingBottom: '4px', cursor: 'pointer' }}>
              Portal de Técnicos (HU-003)
            </span>
          </div>
        </div>

        {activeTab === 'supervisor' && <SupervisorDashboard />}
        {activeTab === 'technician' && <TechnicianDashboard />}
      </main>
    </div>
  );
}

export default App;
