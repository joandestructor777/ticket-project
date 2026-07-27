const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5168';
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'No fue posible comunicarse con el servicio de tickets.');
  return payload;
}
const clientRequest = (clientId, path, options = {}) => request(path, { ...options, headers: { 'X-Client-Id': clientId, ...options.headers } });
export const clientTicketService = {
  getMine: clientId => clientRequest(clientId, '/api/client/tickets'),
  create: (clientId, ticket) => clientRequest(clientId, '/api/client/tickets', { method: 'POST', body: JSON.stringify(ticket) })
};
export const ticketService = {
  getTickets: () => request('/api/tickets'),
  reopenTicket: (ticketId, justification) => request(`/api/tickets/${ticketId}/reopen`, { method: 'POST', body: JSON.stringify({ justification }) })
};
