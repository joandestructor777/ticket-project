using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<IEnumerable<Ticket>> GetAllTicketsAsync()
    {
        return await _ticketRepository.GetAllAsync();
    }

    public async Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification)
    {
        var ticket = await _ticketRepository.GetByIdAsync(ticketId);
        
        if (ticket == null)
            throw new Exception("Ticket no encontrado.");

        if (ticket.State != TicketState.Resolved)
            throw new Exception("Solo se pueden reabrir tickets en estado Resuelto.");

        var gracePeriodStr = await _ticketRepository.GetSystemSettingAsync("GracePeriodHours") ?? "48";
        if (!int.TryParse(gracePeriodStr, out int gracePeriodHours))
            gracePeriodHours = 48;

        if (ticket.ResolutionDate.HasValue && (DateTime.UtcNow - ticket.ResolutionDate.Value).TotalHours > gracePeriodHours)
        {
            ticket.State = TicketState.Closed;
            await _ticketRepository.UpdateAsync(ticket);
            throw new Exception("El plazo de gracia ha expirado. El ticket ha sido cerrado definitivamente. Por favor, abra un nuevo ticket.");
        }

        ticket.State = TicketState.Reopened;
        ticket.ReopenJustification = justification;
        ticket.ResolutionDate = null; // Reiniciar la fecha de resolución ya que vuelve a estar abierto

        await _ticketRepository.UpdateAsync(ticket);

        return ticket;
    }
}
