namespace Helpdesk.Domain.Entities;

public sealed class Technician
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public int MaxOpenTickets { get; set; } = 5;

    public bool IsActive { get; set; } = true;

    public ICollection<TechnicianSpecialty> Specialties { get; set; }
        = new List<TechnicianSpecialty>();
}