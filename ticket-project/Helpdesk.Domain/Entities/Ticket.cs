using Helpdesk.Domain.Enums;

namespace Helpdesk.Domain.Entities;

public class Ticket
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string CreatedByClientId { get; set; } = string.Empty;
    public Guid? AssignedTechnicianId { get; set; }
    public Technician? AssignedTechnician { get; set; }
    public TicketState State { get; set; } = TicketState.Opened;
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    public DateTime LimitDateSLA { get; set; }
    public DateTime? ResolutionDate { get; set; }
    public string? ResolutionComment { get; set; }
    public string? ReopenJustification { get; set; }
    public bool RegisteredExpirationAlert { get; set; }
    public string? LogAlert { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    public ICollection<TicketComment> Comments { get; set; }
    = new List<TicketComment>();

    public void StartProcess()
{
    if (State != TicketState.Assigned &&
        State != TicketState.Reopened)
        throw new InvalidOperationException(
            "Solo los tickets asignados pueden iniciar el proceso de atención.");

    State = TicketState.OnProcess;
}

public void AddProgressComment(TicketComment comment)
{
    if (State != TicketState.OnProcess)
        throw new InvalidOperationException(
            "Solo se pueden agregar comentarios de avance a tickets en proceso.");

    RegisterComment(comment, false);
}

public void Resolve(TicketComment resolutionComment)
{
    if (State != TicketState.OnProcess &&
        State != TicketState.Expired)
        throw new InvalidOperationException(
            "Solo los tickets en proceso pueden resolverse.");

    RegisterComment(resolutionComment, true);

    State = TicketState.Resolved;
    ResolutionDate = DateTime.UtcNow;
}

public void Close()
{
    if (State != TicketState.Resolved)
        throw new InvalidOperationException(
            "Solo los tickets resueltos pueden cerrarse.");

    if (!Comments.Any(comment => comment.IsResolution))
        throw new InvalidOperationException(
            "Acción bloqueada: Debe registrar al menos un comentario de resolución antes de cerrar el ticket.");

    State = TicketState.Closed;
}

private void RegisterComment(TicketComment comment, bool isResolution)
{
    if (string.IsNullOrWhiteSpace(comment.Content))
        throw new ArgumentException("El comentario no puede estar vacío.");

    comment.TicketId = Id;
    comment.IsResolution = isResolution;

    Comments.Add(comment);
}

    public void AssignTo(Guid technicianId)
    {
        if (technicianId == Guid.Empty)
            throw new ArgumentException("El técnico asignado no es válido.");
        if (State != TicketState.Opened)
            throw new InvalidOperationException("Solo se pueden asignar tickets que estén abiertos.");

        AssignedTechnicianId = technicianId;
        State = TicketState.Assigned;
    }

    public void MarkAsDefeated(string reason)
    {
        if (State is TicketState.Resolved or TicketState.Closed)
            return;

        State = TicketState.Expired;
        RegisteredExpirationAlert = true;
        LogAlert = $"[ALERTA DE SLA VENCIDO - {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC] Razón: {reason}";
    }
}
