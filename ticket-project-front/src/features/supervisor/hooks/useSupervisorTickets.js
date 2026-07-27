import { useCallback, useEffect, useMemo, useState } from 'react';
import { ticketService } from '../../tickets/services/ticketService';

export const useSupervisorTickets = () => {
  const [tickets, setTickets] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); const [priorityFilter, setPriorityFilter] = useState('All');
  const fetchTickets = useCallback(async () => { try { setLoading(true); setError(''); setTickets(await ticketService.getTickets()); } catch (exception) { setError(exception.message); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchTickets(); }, [fetchTickets]);
  const filteredTickets = useMemo(() => tickets.filter(ticket => (categoryFilter === 'All' || ticket.category === categoryFilter) && (priorityFilter === 'All' || ticket.priority === priorityFilter)).sort((first, second) => {
    if (first.state === 'Expired' && second.state !== 'Expired') return -1; if (second.state === 'Expired' && first.state !== 'Expired') return 1; return new Date(second.creationDate) - new Date(first.creationDate);
  }), [tickets, categoryFilter, priorityFilter]);
  const metrics = useMemo(() => ({ total: tickets.length, expiredCount: tickets.filter(ticket => ticket.state === 'Expired').length, activeCount: tickets.filter(ticket => ['Opened', 'Assigned', 'OnProcess', 'Reopened'].includes(ticket.state)).length, resolvedCount: tickets.filter(ticket => ['Resolved', 'Closed'].includes(ticket.state)).length }), [tickets]);
  return { tickets: filteredTickets, loading, error, categoryFilter, setCategoryFilter, priorityFilter, setPriorityFilter, metrics, refresh: fetchTickets };
};
