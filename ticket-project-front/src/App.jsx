import React, { useState } from 'react';
import Header from './shared/components/Header';
import Main from './shared/components/Main';
import './index.css';

function App() {
  const [activePortal, setActivePortal] = useState('reports');

  return (
    <div className="app-container">
      <Header />
      <Main activePortal={activePortal} setActivePortal={setActivePortal} />
    </div>
  );
}

export default App;
