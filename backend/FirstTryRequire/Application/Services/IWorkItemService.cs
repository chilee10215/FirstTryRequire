using FirstTryRequire.Application.DTOs;

namespace FirstTryRequire.Application.Services;

public interface IWorkItemService
{
    Task<WorkItemDto?> GetByIdAsync(int id);
    Task<IEnumerable<WorkItemDto>> GetAllAsync();
    Task<WorkItemDto?> CreateAsync(CreateWorkItemDto createDto, int userId);
    Task<WorkItemDto?> UpdateAsync(int id, UpdateWorkItemDto updateDto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
    Task<bool> AssignToUserAsync(AssignWorkItemDto assignDto, int adminUserId);
    Task<bool> UpdateUserWorkItemStatusAsync(int userId, int workItemId, UpdateUserWorkItemDto updateDto);
    Task<IEnumerable<WorkItemDto>> GetWorkItemsByUserIdAsync(int userId);
}
