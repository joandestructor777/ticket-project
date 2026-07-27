import React, { useState } from 'react';
import { ticketService } from '../services/ticketService';

const STATUS_BADGES = {
  Opened: { label: 'Abierto', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Assigned: { label: 'Asignado', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  OnProcess: { label: 'En Proceso', bg: '#fef9c3', color: '#a16207', border: '#fef08a' },
  Resolved: { label: 'Resuelto', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Closed: { label: 'Cerrado', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  Expired: { label: 'Vencido (SLA)', bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5' },
  Reopened: { label: 'Reabierto', bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' }
};

const PRIORITY_COLORS = {
  Baja: { color: '#2563eb', bg: '#eff6ff' },
  Media: { color: '#d97706', bg: '#fef3c7' },
  Alta: { color: '#ea580c', bg: '#ffedd5' },
  Crítica: { color: '#dc2626', bg: '#fee2e2' }
};

const formatDate = value => value
  ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Sin fecha';

export default function TicketCard({ ticket }) {
  const [isReopening, setIsReopening] = useState(false);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig = STATUS_BADGES[ticket.state] || STATUS_BADGES.Opened;
  const priorityConfig = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.Media;

  const canReopen = ticket.state === 'Resolved' && ticket.resolutionDate &&
    Date.now() <= new Date(ticket.resolutionDate).getTime() + 48 * 60 * 60 * 1000;

  const reopen = async () => {
    if (!justification.trim()) {
      setError('La justificación es requerida para reabrir.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError('');
      await ticketService.reopenTicket(ticket.id, justification);
      window.location.reload();
    } catch (exception) {
      setError(exception.message || 'Error al reabrir el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article style={{
      background: '#ffffff',
      border: ticket.state === 'Expired' ? '1.5px solid #fca5a5' : '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          <span style={{
            background: statusConfig.bg,
            color: statusConfig.color,
            border: `1px solid ${statusConfig.border}`,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            {statusConfig.label}
          </span>
          <span style={{
            background: priorityConfig.bg,
            color: priorityConfig.color,
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {ticket.priority}
          </span>
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.4' }}>
          {ticket.title}
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {ticket.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ background: 'var(--bg-light)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            📁 {ticket.category}
          </span>
          {ticket.assignedTechnicianId && (
            <span style={{ background: 'var(--bg-light)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              👤 Técnico: {ticket.assignedTechnicianId.slice(0, 8)}
            </span>
          )}
        </div>

        {ticket.resolutionComment && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.8rem', color: '#047857' }}>
            <strong>Solución:</strong> {ticket.resolutionComment}
          </div>
        )}

        {ticket.reopenJustification && (
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.8rem', color: '#c2410c' }}>
            <strong>Justificación Reapertura:</strong> {ticket.reopenJustification}
          </div>
        )}

        {ticket.state === 'Expired' && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: '500' }}>
            ⚠️ Alerta SLA: Tiempo límite excedido. {ticket.logAlert || ''}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: canReopen ? '12px' : '0' }}>
          <span>Creado: {formatDate(ticket.creationDate || ticket.fechaCreacion)}</span>
          <span style={{ color: ticket.state === 'Expired' ? '#dc2626' : 'inherit', fontWeight: ticket.state === 'Expired' ? '600' : 'normal' }}>
            SLA: {formatDate(ticket.limitDateSLA)}
          </span>
        </div>

        {canReopen && !isReopening && (
          <button 
            onClick={() => setIsReopening(true)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔄 Reabrir Ticket (Periodo de Gracia)
          </button>
        )}

        {isReopening && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea 
              value={justification} 
              onChange={e => setJustification(e.target.value)} 
              placeholder="Escribe la justificación obligatoria para reabrir este ticket..." 
              style={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                padding: '8px',
                fontSize: '0.8rem',
                minHeight: '60px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={reopen}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isSubmitting ? 'Guardando...' : 'Confirmar Reapertura'}
              </button>
              <button 
                onClick={() => { setIsReopening(false); setError(''); }}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
            {error && <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: '500' }}>{error}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
