import React from 'react';

const CATEGORY_COLORS = {
  Hardware: '#4f46e5',
  Software: '#0284c7',
  Red: '#059669',
  Otro: '#d97706'
};

const isExpired = (state) => state === 'Expired' || state === 6 || state === '6';
const isResolved = (state) => ['Resolved', 'Closed', 4, 5, '4', '5'].includes(state);

export default function DashboardCharts({ tickets }) {
  const byCategory = tickets.reduce((result, ticket) => {
    result[ticket.category] = (result[ticket.category] || 0) + 1;
    return result;
  }, {});

  const byTechnician = tickets.reduce((result, ticket) => {
    if (!ticket.assignedTechnicianId) return result;
    const key = String(ticket.assignedTechnicianId).slice(0, 8);
    if (!result[key]) result[key] = { resolved: 0, expired: 0, total: 0 };
    if (isExpired(ticket.state)) result[key].expired += 1;
    if (isResolved(ticket.state)) result[key].resolved += 1;
    result[key].total += 1;
    return result;
  }, {});

  const categoryTotal = Math.max(tickets.length, 1);
  const totalResolved = tickets.filter(t => isResolved(t.state)).length;
  const totalExpired = tickets.filter(t => isExpired(t.state)).length;
  const totalEvaluated = totalResolved + totalExpired;
  const overallSlaPercent = totalEvaluated > 0 ? Math.round((totalResolved / totalEvaluated) * 100) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
            Nivel Global de Cumplimiento SLA
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Porcentaje de solicitudes resueltas dentro del tiempo límite establecido.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: overallSlaPercent >= 80 ? '#059669' : '#dc2626' }}>
              {overallSlaPercent}%
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              {totalResolved} resueltos / {totalExpired} vencidos
            </span>
          </div>
          <div style={{
            width: '120px',
            height: '10px',
            background: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${overallSlaPercent}%`,
              background: overallSlaPercent >= 80 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f87171, #dc2626)',
              borderRadius: '999px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-main)' }}>
              Rendimiento por Técnico
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-light)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)', fontWeight: '500' }}>
              {Object.keys(byTechnician).length} Técnico(s)
            </span>
          </div>

          {Object.keys(byTechnician).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No hay tickets asignados a técnicos en este período.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(byTechnician).map(([technician, values]) => {
                const total = values.resolved + values.expired || 1;
                const resolvedPct = Math.round((values.resolved / total) * 100);
                const expiredPct = Math.round((values.expired / total) * 100);

                return (
                  <div key={technician} style={{
                    background: 'var(--bg-light)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        Técnico #{technician}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: resolvedPct >= 75 ? '#059669' : '#dc2626' }}>
                        {resolvedPct}% Éxito
                      </span>
                    </div>

                    <div style={{
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      marginBottom: '8px'
                    }}>
                      <div style={{ width: `${resolvedPct}%`, background: '#059669', transition: 'width 0.4s ease' }} title={`Resueltos: ${values.resolved}`} />
                      <div style={{ width: `${expiredPct}%`, background: '#dc2626', transition: 'width 0.4s ease' }} title={`Vencidos: ${values.expired}`} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: '#059669', fontWeight: '500' }}>{values.resolved} resueltos</span>
                      <span style={{ color: '#dc2626', fontWeight: '500' }}>{values.expired} vencidos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-main)' }}>
              Distribución por Categoría
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-light)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)', fontWeight: '500' }}>
              {tickets.length} Total
            </span>
          </div>

          {Object.keys(byCategory).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No hay datos de categorías registrados.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(byCategory).map(([category, amount]) => {
                const percentage = Math.round((amount / categoryTotal) * 100);
                const barColor = CATEGORY_COLORS[category] || '#6366f1';

                return (
                  <div key={category} style={{
                    background: 'var(--bg-light)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: barColor, display: 'inline-block' }} />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>{category}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                        {amount} ({percentage}%)
                      </span>
                    </div>

                    <div style={{
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
