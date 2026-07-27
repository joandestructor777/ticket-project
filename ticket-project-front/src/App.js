import React, { useState } from 'react';
import ClientDashboard from './features/client/components/ClientDashboard';
import SupervisorAssignmentDashboard from './features/supervisor/components/SupervisorAssignmentDashboard';
import SupervisorDashboard from './features/supervisor/components/SupervisorDashboard';
import TechnicianDashboard from './features/technician/components/TechnicianDashboard';
import Header from './shared/components/Header';
import './index.css';
import './App.css';

const portals = [
  { id: 'client', label: 'Portal Cliente (HU-001)' },
  { id: 'assignment', label: 'Asignación (HU-002)' },
  { id: 'technician', label: 'Portal técnico (HU-003)' },
  { id: 'reports', label: 'Panel SLAs (HU-004/005/006)' }
];

function App() {
  const [activePortal, setActivePortal] = useState('reports');

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="portal-overview">
          <div>
            <h2>
              Sistema de Mesa de Ayuda (HelpDesk)
            </h2>
            <p>
              Módulos de cliente, asignación, atención técnica y monitoreo de SLA.
            </p>
          </div>
          <nav className="portal-navigation" aria-label="Módulos del sistema">
            {portals.map(portal => (
              <button
                className={
                  activePortal === portal.id
                    ? 'portal-navigation-button portal-navigation-button-active'
                    : 'portal-navigation-button'
                }
                key={portal.id}
                onClick={() => setActivePortal(portal.id)}
                type="button"
              >
                {portal.label}
              </button>
            ))}
          </nav>
        </section>

        {activePortal === 'client' && <ClientDashboard />}
        {activePortal === 'assignment' && <SupervisorAssignmentDashboard />}
        {activePortal === 'technician' && <TechnicianDashboard />}
        {activePortal === 'reports' && <SupervisorDashboard />}
      </main>
    </div>
  );
}

export default App;
