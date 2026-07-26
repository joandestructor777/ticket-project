import React from 'react';
import { useSupervisorTickets } from '../hooks/useSupervisorTickets';
import TicketCard from '../../tickets/components/TicketCard';
import DashboardCharts from './DashboardCharts';
import { useState } from 'react';

const SupervisorDashboard = () => {
  const {
    tickets,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    metrics,
    refresh
  } = useSupervisorTickets();

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'reports'

  const containerStyle = {
    width: '100%',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  };

  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '30px'
  };

  const metricCardStyle = {
    background: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };

  const filterBarStyle = {
    background: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '24px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };

  const selectStyle = {
    background: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-main)',
    padding: '6px 12px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '160px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px'
  };

  return (
    <div style={containerStyle}>
      {/* Botón de recarga */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button 
          onClick={refresh}
          disabled={loading}
          style={{
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
          }}
        >
          {loading ? 'Actualizando...' : '🔄 Actualizar Datos'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button 
          onClick={() => setActiveTab('list')}
          style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'list' ? '700' : '500', color: activeTab === 'list' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', padding: '8px 16px', borderBottom: activeTab === 'list' ? '2px solid var(--primary)' : '2px solid transparent' }}
        >
          Listado de Tickets
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'reports' ? '700' : '500', color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', padding: '8px 16px', borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : '2px solid transparent' }}
        >
          Reportes de Cumplimiento (SLA)
        </button>
      </div>

      {/* Banner de Métricas */}
      <div style={metricsGridStyle}>
        <div style={metricCardStyle}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Tickets Totales</span>
          <span style={{ fontSize: '1.6rem', fontWeight: '700' }}>{metrics.total}</span>
        </div>
        <div style={metricCardStyle}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Monitoreo Activo</span>
          <span style={{ fontSize: '1.6rem', fontWeight: '700', color: '#2563eb' }}>{metrics.activeCount}</span>
        </div>
        <div style={metricCardStyle}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Resueltos</span>
          <span style={{ fontSize: '1.6rem', fontWeight: '700', color: '#059669' }}>{metrics.resolvedCount}</span>
        </div>
        
        {/* Tarjeta de SLA Vencidos */}
        <div 
          style={{ 
            ...metricCardStyle,
            background: metrics.expiredCount > 0 ? 'var(--status-expired-bg)' : '#ffffff', 
            border: metrics.expiredCount > 0 ? '1px solid #fca5a5' : '1px solid var(--border-color)', 
          }}
        >
          <span style={{ color: metrics.expiredCount > 0 ? 'var(--status-expired-text)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            SLA Vencidos
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: '700', color: metrics.expiredCount > 0 ? 'var(--status-expired-text)' : 'var(--text-main)' }}>
            {metrics.expiredCount}
          </span>
        </div>
      </div>

      {activeTab === 'reports' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={filterBarStyle}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Rango de Fechas:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="date" 
                value={dateRange.start} 
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                style={selectStyle}
              />
              <span style={{ color: 'var(--text-muted)' }}>hasta</span>
              <input 
                type="date" 
                value={dateRange.end} 
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                style={selectStyle}
              />
            </div>
            <button
               onClick={() => { setDateRange({start:'', end:''}) }}
               style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >Limpiar Filtros</button>
          </div>
          <DashboardCharts 
            tickets={tickets.filter(t => {
              if (!dateRange.start && !dateRange.end) return true;
              const tDate = new Date(t.fechaCreacion);
              if (dateRange.start && tDate < new Date(dateRange.start)) return false;
              if (dateRange.end && tDate > new Date(dateRange.end)) return false;
              return true;
            })} 
          />
        </div>
      )}

      {activeTab === 'list' && (
        <>
          {/* Barra de Filtros */}
      <div style={filterBarStyle}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>Filtros:</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Categoría</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">Todas</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Red">Red</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prioridad</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">Todas</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>
      </div>

      {/* Indicadores de Carga y Error */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px', flexDirection: 'column', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cargando tickets de soporte...</span>
        </div>
      ) : error ? (
        <div style={{ background: 'var(--status-expired-bg)', border: '1px solid #fca5a5', padding: '16px', borderRadius: '6px', color: 'var(--status-expired-text)', textAlign: 'center', fontSize: '0.85rem' }}>
          <p>{error}</p>
        </div>
      ) : tickets.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '30px', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No se encontraron tickets con los filtros seleccionados.</p>
        </div>
      ) : (
        /* Cuadrícula de Tickets (Vencidos primero) */
        <div style={gridStyle}>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default SupervisorDashboard;
