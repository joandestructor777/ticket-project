import React, { useState, useEffect } from 'react';
import { ticketService } from '../../tickets/services/ticketService';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import { TICKET_STATUS, TICKET_PRIORITIES } from '../../../shared/constants/ticketStatus';

const TECHNICIANS = [
  { id: 1, name: "Carlos (Red y Hardware)" },
  { id: 2, name: "Ana (Software)" },
  { id: 3, name: "Luis (Todas)" }
];

const TechnicianDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTechId, setCurrentTechId] = useState(1);
  const [resolvingTicketId, setResolvingTicketId] = useState(null);
  const [resolutionComment, setResolutionComment] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketsByTechnician(currentTechId);
      setTickets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentTechId]);

  const handleStatusChange = async (ticketId, newState) => {
    if (newState === 3 /* Resolved */) {
      setResolvingTicketId(ticketId);
      return;
    }

    try {
      await ticketService.updateTicketStatus(ticketId, newState, null);
      fetchTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const confirmResolution = async (ticketId) => {
    if (!resolutionComment.trim()) {
      alert("Debes ingresar un comentario de resolución.");
      return;
    }
    try {
      await ticketService.updateTicketStatus(ticketId, 3 /* Resolved */, resolutionComment);
      setResolvingTicketId(null);
      setResolutionComment('');
      fetchTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-main)' }}>Simular Sesión de Técnico</h3>
        <select 
          value={currentTechId} 
          onChange={(e) => setCurrentTechId(parseInt(e.target.value))}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '300px' }}
        >
          {TECHNICIANS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {loading && <p>Cargando tickets asignados...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && tickets.length === 0 && <p>No tienes tickets asignados.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {tickets.map(ticket => (
          <Card key={ticket.id} isExpired={ticket.estado === 'Expired'} className="ticket-card-hover">
            {ticket.estado === 'Expired' && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px', borderRadius: '4px' }}>
                ⚠️ SLA VENCIDO
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{ticket.titulo}</h3>
              <Badge variant={TICKET_PRIORITIES[ticket.prioridad]?.variant || 'default'}>
                {TICKET_PRIORITIES[ticket.prioridad]?.label || ticket.prioridad}
              </Badge>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>{ticket.descripcion}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><strong>Categoría:</strong> {ticket.categoria}</span>
              <Badge variant={TICKET_STATUS[ticket.estado]?.variant || 'default'}>
                {TICKET_STATUS[ticket.estado]?.label || ticket.estado}
              </Badge>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ marginBottom: '4px' }}><strong>Creado:</strong> {formatDate(ticket.fechaCreacion)}</div>
              <div><strong>Límite SLA:</strong> {formatDate(ticket.fechaLimiteSLA)}</div>
            </div>

            {ticket.estado !== 'Resolved' && ticket.estado !== 'Closed' && ticket.estado !== 'Expired' && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                {ticket.estado === 'Assigned' && (
                  <button onClick={() => handleStatusChange(ticket.id, 2 /* OnProcess */)} style={{ flex: 1, padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Iniciar Trabajo (En Proceso)
                  </button>
                )}
                {ticket.estado === 'OnProcess' && (
                  <button onClick={() => handleStatusChange(ticket.id, 3 /* Resolved */)} style={{ flex: 1, padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Resolver Ticket
                  </button>
                )}
              </div>
            )}

            {resolvingTicketId === ticket.id && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold' }}>Comentario de Resolución (Obligatorio):</label>
                <textarea 
                  value={resolutionComment} 
                  onChange={e => setResolutionComment(e.target.value)}
                  style={{ width: '100%', minHeight: '60px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '8px', fontSize: '0.8rem' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setResolvingTicketId(null)} style={{ padding: '6px 12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancelar</button>
                  <button onClick={() => confirmResolution(ticket.id)} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Confirmar</button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
