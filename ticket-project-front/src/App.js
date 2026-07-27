import React, { useState } from 'react';
import ClientDashboard from './features/client/components/ClientDashboard';
import SupervisorAssignmentDashboard from './features/supervisor/components/SupervisorAssignmentDashboard';
import './App.css';

function App() {
  const [activePortal, setActivePortal] = useState('client');

  return (
    <div className="App">
      <header className="app-header">
        <span>Helpdesk</span>

        <nav className="app-navigation">
          <button
            className={
              activePortal === 'client'
                ? 'navigation-button navigation-button-active'
                : 'navigation-button'
            }
            onClick={() => setActivePortal('client')}
          >
            Portal de cliente
          </button>

          <button
            className={
              activePortal === 'supervisor'
                ? 'navigation-button navigation-button-active'
                : 'navigation-button'
            }
            onClick={() => setActivePortal('supervisor')}
          >
            Portal de supervisor
          </button>
        </nav>
      </header>

      {activePortal === 'client' ? (
        <ClientDashboard />
      ) : (
        <SupervisorAssignmentDashboard />
      )}
    </div>
  );
}

export default App;