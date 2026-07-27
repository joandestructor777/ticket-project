namespace Helpdesk.Domain.Entities;

public sealed class TicketComment
{
    public Guid Id { get; set; }

    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public Guid TechnicianId { get; set; }
    public Technician Technician { get; set; } = null!;

    public string Content { get; set; } = string.Empty;

    public bool IsResolution { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}