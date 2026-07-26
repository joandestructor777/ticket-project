import React from 'react';

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '32px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}
          >
            HD
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>
              HelpDesk System
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Gestión de Tickets & SLAs
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-light)',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block'
              }}
            />
            Sistema Activo
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
