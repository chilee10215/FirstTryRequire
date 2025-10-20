using FirstTryRequire.Domain.Entities;

namespace FirstTryRequire.Domain.Interfaces;

public interface IUserWorkItemRepository
{
    Task<UserWorkItem?> GetByUserAndWorkItemAsync(int userId, int workItemId);
    Task<IEnumerable<UserWorkItem>> GetByUserIdAsync(int userId);
    Task<IEnumerable<UserWorkItem>> GetByWorkItemIdAsync(int workItemId);
    Task<UserWorkItem> CreateAsync(UserWorkItem userWorkItem);
    Task<UserWorkItem?> UpdateAsync(UserWorkItem userWorkItem);
    Task<bool> DeleteAsync(int userId, int workItemId);
    Task<bool> ExistsAsync(int userId, int workItemId);
}
