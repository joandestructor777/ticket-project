import React, { useState } from 'react';
import ClientDashboard from './features/client/components/ClientDashboard';
import SupervisorAssignmentDashboard from './features/supervisor/components/SupervisorAssignmentDashboard';
import SupervisorDashboard from './features/supervisor/components/SupervisorDashboard';
import './App.css';

function App() {
  const [activePortal, setActivePortal] = useState('client');
  return (
    <div className="App">
      <header className="app-header"><span>Helpdesk</span><nav className="app-navigation">
        <button className={activePortal === 'client' ? 'navigation-button navigation-button-active' : 'navigation-button'} onClick={() => setActivePortal('client')}>Portal de cliente</button>
        <button className={activePortal === 'assignment' ? 'navigation-button navigation-button-active' : 'navigation-button'} onClick={() => setActivePortal('assignment')}>Asignación de supervisor</button>
        <button className={activePortal === 'reports' ? 'navigation-button navigation-button-active' : 'navigation-button'} onClick={() => setActivePortal('reports')}>Panel y reportes</button>
      </nav></header>
      {activePortal === 'client' && <ClientDashboard />}
      {activePortal === 'assignment' && <SupervisorAssignmentDashboard />}
      {activePortal === 'reports' && <SupervisorDashboard />}
    </div>
  );
}

export default App;
