using FirstTryRequire.Domain.Entities;

namespace FirstTryRequire.Domain.Interfaces;

public interface IWorkItemRepository
{
    Task<WorkItem?> GetByIdAsync(int id);
    Task<IEnumerable<WorkItem>> GetAllAsync();
    Task<WorkItem> CreateAsync(WorkItem workItem);
    Task<WorkItem?> UpdateAsync(WorkItem workItem);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
