using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ISystemSettingRepository
{
    Task<SystemSetting?> GetByKeyAsync(
        string key,
        CancellationToken cancellationToken = default);
}
