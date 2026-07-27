using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Repositories;

public sealed class SystemSettingRepository : ISystemSettingRepository
{
    private readonly HelpdeskDbContext _context;

    public SystemSettingRepository(HelpdeskDbContext context)
    {
        _context = context;
    }

    public Task<SystemSetting?> GetByKeyAsync(
        string key,
        CancellationToken cancellationToken = default) =>
        _context.SystemSettings
            .AsNoTracking()
            .SingleOrDefaultAsync(
                setting => setting.Key == key,
                cancellationToken);
}
