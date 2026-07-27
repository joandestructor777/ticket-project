import React, { useState } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import { TICKET_STATUS, TICKET_PRIORITIES } from '../../../shared/constants/ticketStatus';
import { ticketService } from '../services/ticketService';

const TicketCard = ({ ticket }) => {
  const isExpired = ticket.estado === 'Expired';
  const statusInfo = TICKET_STATUS[ticket.estado] || { label: ticket.estado, bgVar: '', textVar: '', icon: '❓' };
  const priorityInfo = TICKET_PRIORITIES[ticket.priority] || { label: ticket.priority, bgVar: '', textVar: '' };

  // Formatear fecha a formato local legible
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [isReopening, setIsReopening] = useState(false);
  const [justification, setJustification] = useState('');
  const [reopenError, setReopenError] = useState('');

  const isWithinGracePeriod = () => {
    if (ticket.estado !== 'Resolved' || !ticket.fechaResolucion) return false;
    const resolvedDate = new Date(ticket.fechaResolucion);
    const now = new Date();
    const diffHours = (now - resolvedDate) / (1000 * 60 * 60);
    return diffHours <= 48;
  };

  const handleReopen = async () => {
    if (!justification.trim()) {
      setReopenError('Debe ingresar una justificación.');
      return;
    }
    
    try {
      setReopenError('');
      await ticketService.reopenTicket(ticket.id, justification);
      alert('Ticket reabierto exitosamente. Por favor, actualice la vista.');
      setIsReopening(false);
      setJustification('');
    } catch (err) {
      setReopenError(err.message || 'Error al reabrir el ticket');
    }
  };

  return (
    <Card isExpired={isExpired} className="ticket-card-hover">
      {/* Banner plano de SLA Vencido (estilo Jira corporativo, sin parpadeos) */}
      {isExpired && (
        <div 
          style={{
            background: 'var(--status-expired-bg)',
            border: '1px solid #fca5a5',
            color: 'var(--status-expired-text)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '4px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🚨</span>
            <span>SLA VENCIDO</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>
            Límite: {formatDate(ticket.limitDateSla)}
          </span>
        </div>
      )}

      {/* Cabecera: Título e ID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h3 
          style={{ 
            fontSize: '0.95rem', 
            fontWeight: '600', 
            lineHeight: '1.4',
            color: isExpired ? 'var(--status-expired-text)' : 'var(--text-main)',
            maxWidth: '82%'
          }}
        >
          {ticket.title}
        </h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}>
          #{ticket.id}
        </span>
      </div>

      {/* Descripción */}
      <p 
        style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.8rem', 
          lineHeight: '1.5',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {ticket.description}
      </p>

      {/* Badges / Etiquetas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <Badge text={statusInfo.label} bgVar={statusInfo.bgVar} textVar={statusInfo.textVar} icon={statusInfo.icon} />
        <Badge text={`Prioridad: ${priorityInfo.label}`} bgVar={priorityInfo.bgVar} textVar={priorityInfo.textVar} />
        <Badge text={`Categoría: ${ticket.category}`} bgVar="--primary-light" textVar="--primary" />
      </div>

      {/* Footer Info */}
      <div 
        style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '12px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}
      >
        <div>
          <span>Creado: </span>
          <span style={{ color: 'var(--text-main)' }}>{formatDate(ticket.fechaCreacion)}</span>
        </div>
        {!isExpired && (
          <div>
            <span>Límite SLA: </span>
            <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
              {formatDate(ticket.fechaLimiteSLA)}
            </span>
          </div>
        )}
      </div>

      {/* Log de Alerta de Auditoría (Formato plano simple) */}
      {isExpired && ticket.logAlerta && (
        <div 
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            backgroundColor: '#fff5f5',
            borderLeft: '3px solid #ef4444',
            fontSize: '0.7rem',
            color: '#b91c1c',
            fontFamily: 'monospace',
            borderRadius: '0 4px 4px 0'
          }}
        >
          {ticket.logAlerta}
        </div>
      )}

      {/* Botón Reabrir Ticket */}
      {isWithinGracePeriod() && !isReopening && (
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button 
            onClick={() => setIsReopening(true)}
            style={{
              background: '#ffffff',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Reabrir Ticket
          </button>
        </div>
      )}

      {isReopening && (
        <div style={{ marginTop: '16px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#f8fafc' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
            Justificación de Reapertura:
          </label>
          <textarea 
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '60px', fontSize: '0.8rem', marginBottom: '8px' }}
            placeholder="Ingrese el motivo por el cual la solución no fue satisfactoria..."
          />
          {reopenError && <p style={{ color: 'red', fontSize: '0.75rem', marginBottom: '8px' }}>{reopenError}</p>}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsReopening(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleReopen} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
              Confirmar Reapertura
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TicketCard;
