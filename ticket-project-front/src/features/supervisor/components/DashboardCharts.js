import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#6366f1', '#ef4444'];

const DashboardCharts = ({ tickets }) => {
  // 1. Rendimiento por Técnico (Bar Chart: Resueltos a tiempo vs Vencidos)
  const technicianDataMap = {};

  tickets.forEach(ticket => {
    if (!ticket.technicianId) return;
    
    const techName = `Técnico ${ticket.technicianId}`;
    if (!technicianDataMap[techName]) {
      technicianDataMap[techName] = { name: techName, resueltosATiempo: 0, vencidos: 0, total: 0 };
    }

    technicianDataMap[techName].total++;

    if (ticket.estado === 'Expired') {
      technicianDataMap[techName].vencidos++;
    } else if (ticket.estado === 'Resolved' || ticket.estado === 'Closed') {
      // Si se resolvió y no expiró, asumimos que fue a tiempo (basado en la lógica actual)
      technicianDataMap[techName].resueltosATiempo++;
    }
  });

  const barChartData = Object.values(technicianDataMap).map(tech => {
    // Calculamos porcentajes
    const total = tech.resueltosATiempo + tech.vencidos;
    const resueltosPct = total > 0 ? ((tech.resueltosATiempo / total) * 100).toFixed(0) : 0;
    const vencidosPct = total > 0 ? ((tech.vencidos / total) * 100).toFixed(0) : 0;
    
    return {
      ...tech,
      resueltosATiempoPct: Number(resueltosPct),
      vencidosPct: Number(vencidosPct)
    };
  });

  // 2. Rendimiento por Categoría (Pie Chart)
  const categoryDataMap = {};
  
  tickets.forEach(ticket => {
    const category = ticket.category || 'Otro';
    if (!categoryDataMap[category]) {
      categoryDataMap[category] = { name: category, value: 0 };
    }
    
    // Contamos tickets resueltos a tiempo para medir el nivel de cumplimiento
    if (ticket.estado === 'Resolved' || ticket.estado === 'Closed') {
       categoryDataMap[category].value++;
    }
  });

  const pieChartData = Object.values(categoryDataMap).filter(d => d.value > 0);

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    height: '400px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '24px',
    marginBottom: '30px'
  };

  return (
    <div style={gridStyle}>
      {/* Gráfico 1: Rendimiento por Técnico */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: 'var(--text-main)' }}>
          Rendimiento por Técnico (SLA)
        </h3>
        {barChartData.length === 0 ? (
          <div style={{ display: 'flex', height: '80%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No hay datos de técnicos asignados.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <RechartsTooltip 
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{ borderRadius: '6px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="resueltosATiempoPct" name="Resueltos a Tiempo (%)" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vencidosPct" name="Vencidos (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gráfico 2: Cumplimiento por Categoría */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: 'var(--text-main)' }}>
          Cumplimiento SLA por Categoría
        </h3>
        {pieChartData.length === 0 ? (
          <div style={{ display: 'flex', height: '80%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No hay datos de resolución.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [value, 'Tickets Resueltos']} 
                contentStyle={{ borderRadius: '6px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
