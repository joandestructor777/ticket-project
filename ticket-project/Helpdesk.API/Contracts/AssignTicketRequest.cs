namespace Helpdesk.API.Contracts;

public sealed class AssignTicketRequest
{
    public Guid TechnicianId { get; init; }

    public bool ForceAssignment { get; init; }
}