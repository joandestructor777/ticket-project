using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Support;

namespace Helpdesk.Application.Services;

public sealed class AssignmentService : IAssignmentService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ITechnicianRepository _technicianRepository;

    public AssignmentService(
        ITicketRepository ticketRepository,
        ITechnicianRepository technicianRepository)
    {
        _ticketRepository = ticketRepository;
        _technicianRepository = technicianRepository;
    }

    public async Task<IReadOnlyList<OpenTicketForAssignmentResult>> GetOpenTicketsAsync(
        CancellationToken cancellationToken = default)
    {
        var tickets = await _ticketRepository.GetOpenTicketsAsync(cancellationToken);

        return tickets
            .Select(ticket => new OpenTicketForAssignmentResult(
                ticket.Id,
                ticket.Title,
                ticket.Category,
                ticket.Priority,
                ticket.CreationDate,
                ticket.LimitDateSLA))
            .ToList();
    }

    public async Task<IReadOnlyList<TechnicianAvailabilityResult>> GetAvailableTechniciansAsync(
        string category,
        bool includeAtCapacityTechnicians = false,
        CancellationToken cancellationToken = default)
    {
        var normalizedCategory = NormalizeCategory(category);

        var technicians = await _technicianRepository.GetByCategoryAsync(
            normalizedCategory,
            cancellationToken);

        var availableTechnicians = new List<TechnicianAvailabilityResult>();

        foreach (var technician in technicians)
        {
            var activeTickets = await _ticketRepository
                .CountActiveTicketsByTechnicianIdAsync(
                    technician.Id,
                    cancellationToken);

            var availableCapacity = technician.MaxOpenTickets - activeTickets;

            if (availableCapacity > 0 || includeAtCapacityTechnicians)
            {
                availableTechnicians.Add(new TechnicianAvailabilityResult(
                    technician.Id,
                    technician.FullName,
                    technician.MaxOpenTickets,
                    activeTickets,
                    Math.Max(0, availableCapacity)));
            }
        }

        return availableTechnicians
            .OrderByDescending(technician => technician.AvailableCapacity)
            .ThenBy(technician => technician.FullName)
            .ToList();
    }

    public async Task<TicketAssignmentResult> AssignAsync(
        Guid ticketId,
        AssignTicketCommand command,
        CancellationToken cancellationToken = default)
    {
        ValidateAssignmentIds(ticketId, command.TechnicianId);

        var ticket = await GetTicketAsync(ticketId, cancellationToken);
        var technician = await GetTechnicianAsync(command.TechnicianId, cancellationToken);

        ValidateSpecialty(technician, ticket.Category);

        var activeTickets = await _ticketRepository
            .CountActiveTicketsByTechnicianIdAsync(
                technician.Id,
                cancellationToken);

        if (activeTickets >= technician.MaxOpenTickets &&
            !command.ForceAssignment)
        {
            throw new InvalidOperationException(
                "No hay técnicos especializados disponibles con cupo libre.");
        }

        ticket.AssignTo(technician.Id);

        await _ticketRepository.UpdateAsync(ticket);

        return new TicketAssignmentResult(
            ticket.Id,
            technician.Id,
            ticket.State.ToString());
    }

    private static string NormalizeCategory(string category)
    {
        if (!SupportCatalog.TryNormalizeCategory(category, out var normalizedCategory))
        {
            throw new ArgumentException(
                "La categoría seleccionada no es válida.");
        }

        return normalizedCategory;
    }

    private static void ValidateAssignmentIds(Guid ticketId, Guid technicianId)
    {
        if (ticketId == Guid.Empty)
            throw new ArgumentException("El ticket no es válido.");

        if (technicianId == Guid.Empty)
            throw new ArgumentException("El técnico no es válido.");
    }

    private async Task<Ticket> GetTicketAsync(Guid ticketId, CancellationToken cancellationToken) =>
        await _ticketRepository.GetByIdAsync(ticketId, cancellationToken)
        ?? throw new KeyNotFoundException("El ticket solicitado no existe.");

    private async Task<Technician> GetTechnicianAsync(
        Guid technicianId,
        CancellationToken cancellationToken)
    {
        var technician = await _technicianRepository.GetByIdAsync(technicianId, cancellationToken);

        if (technician is null || !technician.IsActive)
        {
            throw new InvalidOperationException("El técnico seleccionado no está disponible.");
        }

        return technician;
    }

    private static void ValidateSpecialty(Technician technician, string category)
    {
        var canAttendCategory = technician.Specialties.Any(specialty =>
            string.Equals(specialty.Category, category, StringComparison.OrdinalIgnoreCase));

        if (!canAttendCategory)
        {
            throw new InvalidOperationException(
                "El técnico no posee la especialidad requerida para este ticket.");
        }
    }
}
