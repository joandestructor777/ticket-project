export const ticketService = {
  getTickets: async () => []
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5168';
async function request(clientId, path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-Client-Id': clientId, ...options.headers }
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'No fue posible comunicarse con el servicio de tickets.');
  return payload;
}

export const clientTicketService = {
  getMine: (clientId) => request(clientId, '/api/client/tickets'),
  create: (clientId, ticket) => request(clientId, '/api/client/tickets', { method: 'POST', body: JSON.stringify(ticket) })
};
