import { useState, useEffect, useMemo } from 'react';
import { ticketService } from '../../tickets/services/ticketService';

export const useSupervisorTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch helpdesk tickets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter and sort tickets (EXPIRED tickets always first)
  const processedTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
        const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
        return matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        // Critical SLA Sorting: Expired tickets are boosted to the top
        const aIsExpired = a.estado === 'Expired';
        const bIsExpired = b.estado === 'Expired';

        if (aIsExpired && !bIsExpired) return -1;
        if (!aIsExpired && bIsExpired) return 1;
        
        // Secondary sort: newest creation date first
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      });
  }, [tickets, categoryFilter, priorityFilter]);

  // Statistics calculation for metrics banner
  const metrics = useMemo(() => {
    const total = tickets.length;
    const expiredCount = tickets.filter(t => t.estado === 'Expired').length;
    const activeCount = tickets.filter(t => ['Opened', 'Assigned', 'OnProcess', 'Reopened'].includes(t.estado)).length;
    const resolvedCount = tickets.filter(t => ['Resolved', 'Closed'].includes(t.estado)).length;
    
    return {
      total,
      expiredCount,
      activeCount,
      resolvedCount
    };
  }, [tickets]);

  return {
    tickets: processedTickets,
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
