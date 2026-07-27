using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public sealed class TechnicianTicketService : ITechnicianTicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TechnicianTicketService(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<IReadOnlyList<TechnicianTicketResult>> GetAssignedTicketsAsync(
        Guid technicianId,
        CancellationToken cancellationToken = default)
    {
        var tickets = await _ticketRepository.GetByTechnicianIdAsync(
            technicianId,
            cancellationToken);

        return tickets
            .Select(MapTicket)
            .ToList();
    }

    public async Task<TechnicianTicketResult> StartProcessAsync(
        Guid ticketId,
        TechnicianTicketActionCommand command,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetAssignedTicketAsync(
            ticketId,
            command.TechnicianId,
            cancellationToken);

        ticket.StartProcess();

        await SaveTicketAsync(ticket, command.RowVersion, cancellationToken);

        return MapTicket(ticket);
    }

    public async Task<TechnicianTicketResult> AddProgressCommentAsync(
        Guid ticketId,
        RegisterTechnicianCommentCommand command,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetAssignedTicketAsync(
            ticketId,
            command.TechnicianId,
            cancellationToken);

        ticket.AddProgressComment(new TicketComment
        {
            TechnicianId = command.TechnicianId,
            Content = command.Content.Trim()
        });

        await SaveTicketAsync(ticket, command.RowVersion, cancellationToken);

        return MapTicket(ticket);
    }

    public async Task<TechnicianTicketResult> ResolveAsync(
        Guid ticketId,
        RegisterTechnicianCommentCommand command,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetAssignedTicketAsync(
            ticketId,
            command.TechnicianId,
            cancellationToken);

        ticket.Resolve(new TicketComment
        {
            TechnicianId = command.TechnicianId,
            Content = command.Content.Trim()
        });

        await SaveTicketAsync(ticket, command.RowVersion, cancellationToken);

        return MapTicket(ticket);
    }

    public async Task<TechnicianTicketResult> CloseAsync(
        Guid ticketId,
        TechnicianTicketActionCommand command,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetAssignedTicketAsync(
            ticketId,
            command.TechnicianId,
            cancellationToken);

        ticket.Close();

        await SaveTicketAsync(ticket, command.RowVersion, cancellationToken);

        return MapTicket(ticket);
    }

    private async Task<Ticket> GetAssignedTicketAsync(
        Guid ticketId,
        Guid technicianId,
        CancellationToken cancellationToken)
    {
        if (technicianId == Guid.Empty)
            throw new ArgumentException("El técnico no es válido.");

        var ticket = await _ticketRepository.GetByIdAsync(
            ticketId,
            cancellationToken)
            ?? throw new KeyNotFoundException("El ticket no existe.");

        if (ticket.AssignedTechnicianId != technicianId)
            throw new UnauthorizedAccessException(
                "El técnico no tiene permiso para modificar este ticket.");

        return ticket;
    }

    private async Task SaveTicketAsync(
        Ticket ticket,
        string rowVersion,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(rowVersion))
            throw new ArgumentException(
                "La versión del ticket es obligatoria. Actualiza el listado e inténtalo nuevamente.");

        byte[] expectedRowVersion;

        try
        {
            expectedRowVersion = Convert.FromBase64String(rowVersion);
        }
        catch (FormatException)
        {
            throw new ArgumentException("La versión del ticket no es válida.");
        }

        if (!ticket.RowVersion.SequenceEqual(expectedRowVersion))
        {
            throw new InvalidOperationException(
                "El ticket ha sido modificado por otro usuario. Por favor actualice el listado.");
        }

        await _ticketRepository.UpdateAsync(
            ticket,
            cancellationToken);
    }

    private static TechnicianTicketResult MapTicket(Ticket ticket) =>
        new(
            ticket.Id,
            ticket.Title,
            ticket.Description,
            ticket.Category,
            ticket.Priority,
            ticket.State.ToString(),
            ticket.CreationDate,
            ticket.LimitDateSLA,
            ticket.ResolutionDate,
            Convert.ToBase64String(ticket.RowVersion),
            ticket.Comments
                .OrderBy(comment => comment.CreatedAt)
                .Select(comment => new TicketCommentResult(
                    comment.Id,
                    comment.TechnicianId,
                    comment.Content,
                    comment.IsResolution,
                    comment.CreatedAt))
                .ToList());
}