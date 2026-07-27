import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { clientTicketService } from '../../tickets/services/ticketService';
import Badge from '../../../shared/components/Badge';
import { TICKET_PRIORITIES, TICKET_STATUS } from '../../../shared/constants/ticketStatus';

const initialForm = { title: '', description: '', category: 'Hardware', priority: 'Baja' };
const formatDate = (value) => new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export default function ClientDashboard() {
  const [tickets, setTickets] = useState([]); const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const clientId = useMemo(() => {
    const storageKey = 'helpdesk.client-id';
    const existingId = sessionStorage.getItem(storageKey);
    if (existingId) return existingId;

    const generatedId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, generatedId);
    return generatedId;
  }, []);
  const loadTickets = useCallback(async () => {
  try {
    setLoading(true);
    setError('');

    const clientTickets = await clientTicketService.getMine(clientId);

    setTickets(clientTickets);
  } catch (exception) {
    setError(exception.message);
  } finally {
    setLoading(false);
  }
}, [clientId]);
  useEffect(() => {
  loadTickets();
}, [loadTickets]);
  const handleChange = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault(); if (submitting) return;
    try { setSubmitting(true); setError(''); setSuccess(''); const created = await clientTicketService.create(clientId, form); setSuccess(`El ticket ha sido creado correctamente con vencimiento el ${formatDate(created.limitDateSla)}.`); setForm(initialForm); await loadTickets(); }
    catch (e) { setError(e.message); } finally { setSubmitting(false); }
  };
  return <main className="client-dashboard">
    <section className="client-intro"><div><span className="eyebrow">Portal de clientes</span><h1>Solicita soporte técnico</h1><p>Crea y consulta únicamente los tickets asociados a tu cuenta.</p></div><button className="secondary-button" onClick={loadTickets} disabled={loading}>Actualizar listado</button></section>
    <section className="client-layout">
      <form className="ticket-form" onSubmit={handleSubmit}><h2>Nuevo ticket</h2>
        <label>Título<input name="title" value={form.title} onChange={handleChange} maxLength="150" required /></label>
        <label>Descripción<textarea name="description" value={form.description} onChange={handleChange} maxLength="2000" rows="5" required /></label>
        <div className="form-row"><label>Categoría<select name="category" value={form.category} onChange={handleChange}><option>Hardware</option><option>Software</option><option>Red</option><option>Otro</option></select></label><label>Prioridad<select name="priority" value={form.priority} onChange={handleChange}><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select></label></div>
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Creando ticket…' : 'Crear ticket'}</button>
      </form>
      <section className="my-tickets"><h2>Mis tickets</h2>{success && <p className="notice success">{success}</p>}{error && <p className="notice error">{error}</p>}
        {loading ? <p className="muted">Cargando tickets…</p> : tickets.length === 0 ? <p className="empty-state">Aún no has creado tickets.</p> : <div className="client-ticket-list">{tickets.map((ticket) => { const state = TICKET_STATUS[ticket.state]; const priority = TICKET_PRIORITIES[ticket.priority]; return <article className="client-ticket" key={ticket.id}><div className="ticket-heading"><h3>{ticket.title}</h3><time>{formatDate(ticket.creationDate)}</time></div><p>{ticket.description}</p><div className="ticket-badges"><Badge text={state?.label || ticket.state} bgVar={state?.bgVar} textVar={state?.textVar} icon={state?.icon} /><Badge text={`Prioridad: ${priority?.label || ticket.priority}`} bgVar={priority?.bgVar} textVar={priority?.textVar} /><Badge text={ticket.category} bgVar="--primary-light" textVar="--primary" /></div><small>Vence: <strong>{formatDate(ticket.limitDateSla)}</strong></small></article>; })}</div>}
      </section>
    </section>
  </main>;
}
