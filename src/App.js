import React from 'react';
import SupervisorDashboard from './features/supervisor/components/SupervisorDashboard';

function App() {
  return (
    <div className="App">
      {/* Barra de navegación superior minimalista corporativa */}
      <nav 
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '16px 20px'
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>
              Helpdesk
            </span>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '600', borderBottom: '2px solid var(--primary)', paddingBottom: '4px', cursor: 'pointer' }}>
              Panel de Supervisor
            </span>
            <span style={{ cursor: 'not-allowed', opacity: 0.5 }}>Portal de Clientes (HU-001)</span>
            <span style={{ cursor: 'not-allowed', opacity: 0.5 }}>Portal de Técnicos (HU-003)</span>
          </div>
        </div>
      </nav>

      {/* Panel del Supervisor (Dashboard Principal) */}
      <SupervisorDashboard />
    </div>
  );
}

export default App;
