const API_URL = 'http://localhost:5168/api/tickets';

export const ticketService = {
  getTickets: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los tickets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  reopenTicket: async (ticketId, justification) => {
    try {
      const response = await fetch(`${API_URL}/${ticketId}/reopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ justification })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al reabrir el ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw error;
    }
  }
};
