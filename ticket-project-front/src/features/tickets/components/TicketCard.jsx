import React from 'react';
import { useTicketCard } from '../hooks/useTicketCard';

export default function TicketCard({ ticket }) {
  const {
    statusConfig,
    priorityConfig,
    isExpired,
    canReopen,
    isReopening,
    setIsReopening,
    justification,
    setJustification,
    error,
    isSubmitting,
    isHovered,
    setIsHovered,
    reopen,
    cancelReopen,
    formatDate
  } = useTicketCard(ticket);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#ffffff',
        border: isExpired ? '1.5px solid #fca5a5' : '1px solid var(--border-color)',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isHovered
          ? '0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)'
          : '0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative'
      }}
    >
      <div style={{ height: '4px', background: statusConfig.accent, width: '100%' }} />

      <div style={{ padding: '20px' }}>
        {/* Badges de Estado y Prioridad */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{
            background: statusConfig.bg,
            color: statusConfig.color,
            border: `1px solid ${statusConfig.border}`,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {statusConfig.label}
          </span>

          <span style={{
            background: priorityConfig.bg,
            color: priorityConfig.color,
            border: `1px solid ${priorityConfig.border}`,
            padding: '3px 10px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {ticket.priority}
          </span>
        </div>

        {/* Título y Descripción */}
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.4' }}>
          {ticket.title}
        </h3>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {ticket.description}
        </p>

        {/* Tags de Categoría y Técnico */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <span style={{ background: 'var(--bg-light)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500' }}>
            Categoría: {ticket.category}
          </span>

          {ticket.assignedTechnicianId && (
            <span style={{ background: '#f8fafc', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500' }}>
              Técnico: {String(ticket.assignedTechnicianId).slice(0, 8)}
            </span>
          )}
        </div>

        {/* Cajas informativas especiales */}
        {ticket.resolutionComment && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem', color: '#047857' }}>
            <strong style={{ display: 'block', marginBottom: '2px' }}>Solución Aplicada:</strong>
            {ticket.resolutionComment}
          </div>
        )}

        {ticket.reopenJustification && (
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem', color: '#c2410c' }}>
            <strong style={{ display: 'block', marginBottom: '2px' }}>Justificación de Reapertura:</strong>
            {ticket.reopenJustification}
          </div>
        )}

        {isExpired && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem', color: '#b91c1c', fontWeight: '500' }}>
            <strong>Alerta SLA Vencido:</strong> {ticket.logAlert || 'El tiempo de atención asignado ha expirado sin resolución.'}
          </div>
        )}
      </div>

      {/* Pie de tarjeta con fechas y botón de reapertura */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid var(--border-color)', padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: canReopen ? '12px' : '0' }}>
          <span>Creado: {formatDate(ticket.creationDate || ticket.fechaCreacion)}</span>
          <span style={{ color: isExpired ? '#dc2626' : 'var(--text-main)', fontWeight: '600' }}>
            Límite SLA: {formatDate(ticket.limitDateSLA || ticket.limitDateSla)}
          </span>
        </div>

        {canReopen && !isReopening && (
          <button
            onClick={() => setIsReopening(true)}
            style={{ width: '100%', background: '#ffffff', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', padding: '9px 14px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            Reabrir Ticket (Periodo de Gracia)
          </button>
        )}

        {isReopening && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="Escribe la justificación obligatoria para reabrir este ticket..."
              style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '10px', fontSize: '0.825rem', minHeight: '70px', outline: 'none', fontFamily: 'inherit', background: '#ffffff' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={reopen}
                disabled={isSubmitting}
                style={{ flex: 1, background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Guardando...' : 'Confirmar Reapertura'}
              </button>
              <button
                onClick={cancelReopen}
                style={{ background: '#ffffff', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '6px', padding: '8px 14px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
            {error && <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: '600' }}>{error}</span>}
          </div>
        )}
      </div>
    </article>
  );
}
