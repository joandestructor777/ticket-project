import React, { useState } from 'react';
import ClientDashboard from './features/client/components/ClientDashboard';
import SupervisorAssignmentDashboard from './features/supervisor/components/SupervisorAssignmentDashboard';
import SupervisorDashboard from './features/supervisor/components/SupervisorDashboard';
import Header from './shared/components/Header';
import './index.css';

function App() {
  const [activePortal, setActivePortal] = useState('reports');

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              Sistema de Mesa de Ayuda (HelpDesk)
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Gestión de solicitudes, asignación de técnicos y panel de monitoreo de SLAs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActivePortal('client')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: activePortal === 'client' ? 'var(--primary)' : '#fff',
                color: activePortal === 'client' ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.85rem'
              }}>
              Portal de Cliente
            </button>
            <button 
              onClick={() => setActivePortal('assignment')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: activePortal === 'assignment' ? 'var(--primary)' : '#fff',
                color: activePortal === 'assignment' ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.85rem'
              }}>
              Asignación de Tickets
            </button>
            <button 
              onClick={() => setActivePortal('reports')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: activePortal === 'reports' ? 'var(--primary)' : '#fff',
                color: activePortal === 'reports' ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.85rem'
              }}>
              Panel de SLAs y Monitoreo
            </button>
          </div>
        </div>

        {activePortal === 'client' && <ClientDashboard />}
        {activePortal === 'assignment' && <SupervisorAssignmentDashboard />}
        {activePortal === 'reports' && <SupervisorDashboard />}
      </main>
    </div>
  );
}

export default App;
