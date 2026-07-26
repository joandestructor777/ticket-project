namespace Helpdesk.Domain.Entities
{
    public class Technician
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialties { get; set; } = string.Empty; // e.g. "Hardware,Red"
        public int MaxOpenTickets { get; set; }
    }
}
