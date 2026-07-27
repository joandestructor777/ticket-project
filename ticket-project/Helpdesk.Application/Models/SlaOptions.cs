namespace Helpdesk.Application.Models;

public sealed class SlaOptions
{
    public const string SectionName = "Sla";
    public int DefaultHours { get; init; } = 24;
    public Dictionary<string, int> Rules { get; init; } = new(StringComparer.OrdinalIgnoreCase);
}
