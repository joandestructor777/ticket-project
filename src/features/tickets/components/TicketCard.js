import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import { TICKET_STATUS, TICKET_PRIORITIES } from '../../../shared/constants/ticketStatus';

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
            Límite: {formatDate(ticket.fechaLimiteSLA)}
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
    </Card>
  );
};

export default TicketCard;
