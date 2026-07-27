import React from 'react';

const colors = ['#2563eb', '#059669', '#f59e0b', '#7c3aed'];

export default function DashboardCharts({ tickets }) {
  const byCategory = tickets.reduce((result, ticket) => {
    result[ticket.category] = (result[ticket.category] || 0) + 1;
    return result;
  }, {});
  const byTechnician = tickets.reduce((result, ticket) => {
    if (!ticket.assignedTechnicianId) return result;
    const key = ticket.assignedTechnicianId.slice(0, 8);
    if (!result[key]) result[key] = { resolved: 0, expired: 0 };
    if (ticket.state === 'Expired') result[key].expired += 1;
    if (['Resolved', 'Closed'].includes(ticket.state)) result[key].resolved += 1;
    return result;
  }, {});
  const categoryTotal = Math.max(tickets.length, 1);

  return (
    <section className="dashboard-charts">
      <article className="chart-card">
        <h3>Rendimiento por técnico</h3>
        {Object.keys(byTechnician).length === 0 ? <p className="muted">No hay tickets asignados en este período.</p> : Object.entries(byTechnician).map(([technician, values]) => {
          const total = values.resolved + values.expired || 1;
          return <div key={technician} className="chart-row"><strong>Técnico {technician}</strong><div className="chart-bar"><span style={{ width: `${values.resolved * 100 / total}%` }} title="Resueltos" /><i style={{ width: `${values.expired * 100 / total}%` }} title="Vencidos" /></div><small>{values.resolved} resueltos / {values.expired} vencidos</small></div>;
        })}
      </article>
      <article className="chart-card">
        <h3>Tickets por categoría</h3>
        {Object.keys(byCategory).length === 0 ? <p className="muted">No hay datos para mostrar.</p> : Object.entries(byCategory).map(([category, amount], index) => <div key={category} className="chart-row"><strong>{category}</strong><div className="chart-bar"><span style={{ width: `${amount * 100 / categoryTotal}%`, background: colors[index % colors.length] }} /></div><small>{amount} ticket(s)</small></div>)}
      </article>
    </section>
  );
}
