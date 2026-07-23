using System.ComponentModel.DataAnnotations;

namespace Helpdesk.API.Contracts;

public sealed class CreateTicketRequest
{
    [Required, StringLength(150)]
    public string Title { get; init; } = string.Empty;

    [Required, StringLength(2000)]
    public string Description { get; init; } = string.Empty;

    [Required]
    public string Category { get; init; } = string.Empty;

    [Required]
    public string Priority { get; init; } = string.Empty;
}
