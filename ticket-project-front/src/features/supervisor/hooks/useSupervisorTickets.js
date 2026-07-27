import { useCallback, useEffect, useMemo, useState } from 'react';
import { ticketService } from '../../tickets/services/ticketService';

const isExpired = (state) => state === 'Expired' || state === 6 || state === '6';
const isResolved = (state) => ['Resolved', 'Closed', 4, 5, '4', '5'].includes(state);
const isActive = (state) => ['Opened', 'Assigned', 'OnProcess', 'Reopened', 1, 2, 3, 7, '1', '2', '3', '7'].includes(state);

export const useSupervisorTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const matchesCategory =
          categoryFilter === 'All' || ticket.category === categoryFilter;
        const matchesPriority =
          priorityFilter === 'All' || ticket.priority === priorityFilter;
        return matchesCategory && matchesPriority;
      })
      .sort((first, second) => {
        if (isExpired(first.state) && !isExpired(second.state)) return -1;
        if (isExpired(second.state) && !isExpired(first.state)) return 1;
        return new Date(second.creationDate || second.fechaCreacion) - new Date(first.creationDate || first.fechaCreacion);
      });
  }, [tickets, categoryFilter, priorityFilter]);

  const metrics = useMemo(() => {
    const total = tickets.length;
    const expiredCount = tickets.filter((ticket) => isExpired(ticket.state)).length;
    const activeCount = tickets.filter((ticket) => isActive(ticket.state)).length;
    const resolvedCount = tickets.filter((ticket) => isResolved(ticket.state)).length;

    return {
      total,
      expiredCount,
      activeCount,
      resolvedCount
    };
  }, [tickets]);

  return {
    tickets: filteredTickets,
    loading,
    error,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    metrics,
    refresh: fetchTickets
  };
};
