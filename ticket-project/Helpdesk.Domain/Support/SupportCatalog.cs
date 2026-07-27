namespace Helpdesk.Domain.Support;

public static class SupportCatalog
{
    public static readonly string[] Categories =
    [
        "Hardware",
        "Software",
        "Red",
        "Otro"
    ];

    public static readonly string[] Priorities =
    [
        "Baja",
        "Media",
        "Alta",
        "Crítica"
    ];

    public static bool TryNormalizeCategory(string? value, out string category) =>
        TryNormalize(value, Categories, out category);

    public static bool TryNormalizePriority(string? value, out string priority) =>
        TryNormalize(value, Priorities, out priority);

    private static bool TryNormalize(
        string? value,
        IEnumerable<string> validValues,
        out string normalizedValue)
    {
        normalizedValue = string.Empty;

        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var match = validValues.SingleOrDefault(validValue =>
            string.Equals(validValue, value.Trim(), StringComparison.OrdinalIgnoreCase));

        if (match is null)
        {
            return false;
        }

        normalizedValue = match;
        return true;
    }
}
