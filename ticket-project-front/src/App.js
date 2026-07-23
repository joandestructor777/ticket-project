import React from 'react';
import ClientDashboard from './features/client/components/ClientDashboard';

function App() {
  return (
    <div className="App">
      <header className="app-header"><span>Helpdesk</span><span>Portal de clientes</span></header>
      <ClientDashboard />
    </div>
  );
}

export default App;
