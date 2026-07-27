using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Domain.Support;

namespace Helpdesk.Application.Services;

public sealed class TechnicianManagementService
    : ITechnicianManagementService
{
    private readonly ITechnicianRepository _technicianRepository;

    public TechnicianManagementService(
        ITechnicianRepository technicianRepository)
    {
        _technicianRepository = technicianRepository;
    }

    public async Task<TechnicianResult> CreateAsync(
        CreateTechnicianCommand command,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(command.FullName) ||
            command.FullName.Trim().Length > 150)
        {
            throw new ArgumentException(
                "El nombre del técnico es obligatorio y debe tener máximo 150 caracteres.");
        }

        if (command.MaxOpenTickets <= 0)
        {
            throw new ArgumentException(
                "El máximo de tickets abiertos debe ser mayor que cero.");
        }

        var technicianId = Guid.NewGuid();

        var specialties = (command.Specialties ?? Array.Empty<string>())
            .Select(NormalizeCategory)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(category => new TechnicianSpecialty
            {
                TechnicianId = technicianId,
                Category = category
            })
            .ToList();

        var technician = new Technician
        {
            Id = technicianId,
            FullName = command.FullName.Trim(),
            MaxOpenTickets = command.MaxOpenTickets,
            IsActive = true,
            Specialties = specialties
        };

        await _technicianRepository.AddAsync(
            technician,
            cancellationToken);

        return new TechnicianResult(
            technician.Id,
            technician.FullName,
            technician.MaxOpenTickets,
            technician.IsActive,
            specialties.Select(specialty => specialty.Category).ToList());
    }

    private static string NormalizeCategory(string category)
    {
        if (string.IsNullOrWhiteSpace(category))
        {
            throw new ArgumentException(
                "La especialidad no puede estar vacía.");
        }

        if (!SupportCatalog.TryNormalizeCategory(category, out var normalizedCategory))
        {
            throw new ArgumentException(
                $"La especialidad '{category}' no es válida.");
        }

        return normalizedCategory;
    }
}
