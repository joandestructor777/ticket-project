namespace Helpdesk.Domain.Entities;

public sealed class TechnicianSpecialty
{
    public Guid TechnicianId { get; set; }

    public string Category { get; set; } = string.Empty;

    public Technician Technician { get; set; } = null!;
}