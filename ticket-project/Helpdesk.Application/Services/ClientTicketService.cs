using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Domain.Support;

namespace Helpdesk.Application.Services;

public sealed class ClientTicketService : IClientTicketService
{
    private readonly ITicketRepository _tickets;
    private readonly SlaOptions _slaOptions;

    public ClientTicketService(ITicketRepository tickets, SlaOptions slaOptions)
    {
        _tickets = tickets;
        _slaOptions = slaOptions;
    }

    public async Task<CreatedTicketResult> CreateAsync(string clientId, CreateClientTicketCommand command, CancellationToken cancellationToken = default)
    {
        ValidateClientId(clientId);
        Validate(command);

        SupportCatalog.TryNormalizeCategory(command.Category, out var category);
        SupportCatalog.TryNormalizePriority(command.Priority, out var priority);
        var createdAt = DateTime.UtcNow;
        var slaHours = GetSlaHours(category, priority);
        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            Title = command.Title.Trim(),
            Description = command.Description.Trim(),
            Category = category,
            Priority = priority,
            CreatedByClientId = clientId,
            State = TicketState.Opened,
            CreationDate = createdAt,
            LimitDateSLA = createdAt.AddHours(slaHours)
        };

        await _tickets.AddAsync(ticket, cancellationToken);
        return new CreatedTicketResult(ticket.Id, ticket.LimitDateSLA);
    }

    public async Task<IReadOnlyList<ClientTicketResult>> GetMineAsync(string clientId, CancellationToken cancellationToken = default)
    {
        ValidateClientId(clientId);
        var tickets = await _tickets.GetByClientIdAsync(clientId, cancellationToken);
        return tickets.Select(ticket => new ClientTicketResult(ticket.Id, ticket.Title, ticket.Description,
            ticket.Category, ticket.Priority, ticket.State.ToString(), ticket.CreationDate, ticket.LimitDateSLA)).ToList();
    }

    private int GetSlaHours(string category, string priority)
    {
        return _slaOptions.Rules.TryGetValue($"{category}:{priority}", out var hours) && hours > 0
            ? hours
            : _slaOptions.DefaultHours;
    }

    private static void Validate(CreateClientTicketCommand command)
    {
        if (string.IsNullOrWhiteSpace(command.Title) || command.Title.Trim().Length > 150)
            throw new ArgumentException("El título es obligatorio y debe tener máximo 150 caracteres.");
        if (string.IsNullOrWhiteSpace(command.Description) || command.Description.Trim().Length > 2000)
            throw new ArgumentException("La descripción es obligatoria y debe tener máximo 2000 caracteres.");
        if (!SupportCatalog.TryNormalizeCategory(command.Category, out _))
            throw new ArgumentException("La categoría seleccionada no es válida.");
        if (!SupportCatalog.TryNormalizePriority(command.Priority, out _))
            throw new ArgumentException("La prioridad seleccionada no es válida.");
    }

    private static void ValidateClientId(string clientId)
    {
        if (string.IsNullOrWhiteSpace(clientId) || clientId.Length > 100)
            throw new ArgumentException("El identificador del cliente no es válido.");
    }
}
