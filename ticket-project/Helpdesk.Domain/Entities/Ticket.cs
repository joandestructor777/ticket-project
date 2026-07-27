

using Helpdesk.Domain.Enums;

namespace Helpdesk.Domain.Entities
{
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
        public Boolean RegisteredExpirationAlert { get; set; }
        public string? LogAlert { get; set; }
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
            if (State == TicketState.Resolved || State == TicketState.Closed)
                return;
            State = TicketState.Expired;
            RegisteredExpirationAlert = true;
            LogAlert = $"[ALERTA DE SLA VENCIDO - {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC] Razón: {reason}";
        }
    }
}
