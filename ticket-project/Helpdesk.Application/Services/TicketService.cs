using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository) => _ticketRepository = ticketRepository;

    public Task<IReadOnlyList<Ticket>> GetAllTicketsAsync(CancellationToken cancellationToken = default) =>
        _ticketRepository.GetAllAsync(cancellationToken);

    public Task<IReadOnlyList<Ticket>> GetTicketsByTechnicianAsync(Guid technicianId, CancellationToken cancellationToken = default) =>
        _ticketRepository.GetByTechnicianIdAsync(technicianId, cancellationToken);

    public async Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(justification))
            throw new ArgumentException("La justificación de reapertura es obligatoria.");

        var ticket = await GetTicketAsync(ticketId, cancellationToken);
        if (ticket.State != TicketState.Resolved)
            throw new InvalidOperationException("Solo se pueden reabrir tickets resueltos.");

        var gracePeriodHours = await GetGracePeriodHoursAsync(cancellationToken);
        if (ticket.ResolutionDate is null || DateTime.UtcNow > ticket.ResolutionDate.Value.AddHours(gracePeriodHours))
        {
            ticket.State = TicketState.Closed;
            await _ticketRepository.UpdateAsync(ticket);
            throw new InvalidOperationException("El plazo de gracia expiró; el ticket fue cerrado definitivamente.");
        }

        ticket.State = TicketState.Reopened;
        ticket.ReopenJustification = justification.Trim();
        await _ticketRepository.UpdateAsync(ticket);
        return ticket;
    }

    public async Task<Ticket> UpdateTicketStatusAsync(Guid ticketId, TicketState newState, string? resolutionComment, CancellationToken cancellationToken = default)
    {
        var ticket = await GetTicketAsync(ticketId, cancellationToken);

        if (newState == TicketState.OnProcess && ticket.State != TicketState.Assigned)
            throw new InvalidOperationException("Solo un ticket asignado puede iniciar proceso.");

        if (newState == TicketState.Resolved)
        {
            if (ticket.State is not (TicketState.OnProcess or TicketState.Expired))
                throw new InvalidOperationException("Solo un ticket en proceso o vencido puede resolverse.");
            if (string.IsNullOrWhiteSpace(resolutionComment))
                throw new ArgumentException("El comentario de resolución es obligatorio.");

            ticket.ResolutionComment = resolutionComment.Trim();
            ticket.ResolutionDate = DateTime.UtcNow;
        }

        if (newState == TicketState.Closed &&
            (ticket.State != TicketState.Resolved || string.IsNullOrWhiteSpace(ticket.ResolutionComment)))
        {
            throw new InvalidOperationException("No se puede cerrar un ticket sin comentario de resolución.");
        }

        ticket.State = newState;
        await _ticketRepository.UpdateAsync(ticket);
        return ticket;
    }

    private async Task<Ticket> GetTicketAsync(Guid ticketId, CancellationToken cancellationToken) =>
        await _ticketRepository.GetByIdAsync(ticketId, cancellationToken)
        ?? throw new KeyNotFoundException("El ticket no existe.");

    private async Task<int> GetGracePeriodHoursAsync(CancellationToken cancellationToken)
    {
        var configuredValue = await _ticketRepository.GetSystemSettingAsync("GracePeriodHours", cancellationToken);
        return int.TryParse(configuredValue, out var hours) && hours > 0 ? hours : 48;
    }
}
