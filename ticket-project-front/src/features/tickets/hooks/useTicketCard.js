import { useState } from 'react';
import { ticketService } from '../services/ticketService';

const EXPIRED_BADGE = { label: 'SLA Vencido', bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5', accent: '#ef4444' };
const RESOLVED_BADGE = { label: 'Resuelto', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', accent: '#10b981' };

const STATUS_BADGES = {
  1: { label: 'Abierto', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', accent: '#3b82f6' },
  2: { label: 'Asignado', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', accent: '#8b5cf6' },
  3: { label: 'En Proceso', bg: '#fef9c3', color: '#a16207', border: '#fef08a', accent: '#eab308' },
  4: RESOLVED_BADGE,
  5: { label: 'Cerrado', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', accent: '#64748b' },
  6: EXPIRED_BADGE,
  7: { label: 'Reabierto', bg: '#fff7ed', color: '#c2410c', border: '#ffedd5', accent: '#f97316' },

  Opened: { label: 'Abierto', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', accent: '#3b82f6' },
  Assigned: { label: 'Asignado', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', accent: '#8b5cf6' },
  OnProcess: { label: 'En Proceso', bg: '#fef9c3', color: '#a16207', border: '#fef08a', accent: '#eab308' },
  Resolved: RESOLVED_BADGE,
  Closed: { label: 'Cerrado', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', accent: '#64748b' },
  Expired: EXPIRED_BADGE,
  Reopened: { label: 'Reabierto', bg: '#fff7ed', color: '#c2410c', border: '#ffedd5', accent: '#f97316' },

  // Variaciones en minúsculas y español
  expired: EXPIRED_BADGE,
  vencido: EXPIRED_BADGE,
  'sla vencido': EXPIRED_BADGE,
  resolved: RESOLVED_BADGE,
  resuelto: RESOLVED_BADGE
};

const PRIORITY_COLORS = {
  Baja: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  Media: { color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  Alta: { color: '#ea580c', bg: '#ffedd5', border: '#fed7aa' },
  Crítica: { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }
};

export const formatDate = (value) => value
  ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Sin fecha';

export function useTicketCard(ticket) {
  const [isReopening, setIsReopening] = useState(false);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rawState = String(ticket.state || '').toLowerCase();
  const isExpired = rawState === 'expired' || rawState === '6' || rawState.includes('vencid');
  const isResolved = rawState === 'resolved' || rawState === '4' || rawState.includes('resuelt');

  const statusConfig = isExpired 
    ? EXPIRED_BADGE 
    : isResolved 
      ? RESOLVED_BADGE 
      : STATUS_BADGES[ticket.state] || STATUS_BADGES[rawState] || STATUS_BADGES.Opened;

  const priorityConfig = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.Media;

  const canReopen = isResolved && ticket.resolutionDate &&
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

  const cancelReopen = () => {
    setIsReopening(false);
    setError('');
    setJustification('');
  };

  return {
    statusConfig,
    priorityConfig,
    isExpired,
    isResolved,
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
  };
}
