using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public sealed class ClientTicketService : IClientTicketService
{
    private static readonly HashSet<string> ValidCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        "Hardware", "Software", "Red", "Otro"
    };

    private static readonly HashSet<string> ValidPriorities = new(StringComparer.OrdinalIgnoreCase)
    {
        "Baja", "Media", "Alta", "Crítica"
    };

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

        var category = Normalize(command.Category);
        var priority = Normalize(command.Priority);
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
        if (!ValidCategories.Contains(command.Category ?? string.Empty))
            throw new ArgumentException("La categoría seleccionada no es válida.");
        if (!ValidPriorities.Contains(command.Priority ?? string.Empty))
            throw new ArgumentException("La prioridad seleccionada no es válida.");
    }

    private static void ValidateClientId(string clientId)
    {
        if (string.IsNullOrWhiteSpace(clientId) || clientId.Length > 100)
            throw new ArgumentException("El identificador del cliente no es válido.");
    }

    private static string Normalize(string value) => value.Trim() switch
    {
        var item when item.Equals("hardware", StringComparison.OrdinalIgnoreCase) => "Hardware",
        var item when item.Equals("software", StringComparison.OrdinalIgnoreCase) => "Software",
        var item when item.Equals("red", StringComparison.OrdinalIgnoreCase) => "Red",
        var item when item.Equals("otro", StringComparison.OrdinalIgnoreCase) => "Otro",
        var item when item.Equals("baja", StringComparison.OrdinalIgnoreCase) => "Baja",
        var item when item.Equals("media", StringComparison.OrdinalIgnoreCase) => "Media",
        var item when item.Equals("alta", StringComparison.OrdinalIgnoreCase) => "Alta",
        _ => "Crítica"
    };
}
