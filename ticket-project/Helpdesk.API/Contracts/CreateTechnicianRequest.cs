using System.ComponentModel.DataAnnotations;

namespace Helpdesk.API.Contracts;

public sealed class CreateTechnicianRequest
{
    [Required]
    [StringLength(150)]
    public string FullName { get; init; } = string.Empty;

    [Range(1, 50)]
    public int MaxOpenTickets { get; init; } = 5;

    public IReadOnlyList<string>? Specialties { get; init; }
}