using FirstTryRequire.Application.DTOs;
using FirstTryRequire.Domain.Entities;
using FirstTryRequire.Domain.Interfaces;

namespace FirstTryRequire.Application.Services;

public class WorkItemService : IWorkItemService
{
    private readonly IWorkItemRepository _workItemRepository;
    private readonly IUserWorkItemRepository _userWorkItemRepository;
    private readonly IUserRepository _userRepository;

    public WorkItemService(
        IWorkItemRepository workItemRepository,
        IUserWorkItemRepository userWorkItemRepository,
        IUserRepository userRepository)
    {
        _workItemRepository = workItemRepository;
        _userWorkItemRepository = userWorkItemRepository;
        _userRepository = userRepository;
    }

    public async Task<WorkItemDto?> GetByIdAsync(int id)
    {
        var workItem = await _workItemRepository.GetByIdAsync(id);
        return workItem != null ? MapToDto(workItem) : null;
    }

    public async Task<IEnumerable<WorkItemDto>> GetAllAsync()
    {
        var workItems = await _workItemRepository.GetAllAsync();
        return workItems.Select(MapToDto);
    }

    public async Task<WorkItemDto?> CreateAsync(CreateWorkItemDto createDto, int userId)
    {
        // Check if user is admin
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || user.ManageLevel != ManageLevel.Admin)
        {
            return null;
        }

        var workItem = new WorkItem
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Status = createDto.Status
        };

        var createdWorkItem = await _workItemRepository.CreateAsync(workItem);
        return MapToDto(createdWorkItem);
    }

    public async Task<WorkItemDto?> UpdateAsync(int id, UpdateWorkItemDto updateDto, int userId)
    {
        // Check if user is admin
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || user.ManageLevel != ManageLevel.Admin)
        {
            return null;
        }

        var workItem = await _workItemRepository.GetByIdAsync(id);
        if (workItem == null)
        {
            return null;
        }

        workItem.Title = updateDto.Title;
        workItem.Description = updateDto.Description;
        workItem.Status = updateDto.Status;

        var updatedWorkItem = await _workItemRepository.UpdateAsync(workItem);
        return updatedWorkItem != null ? MapToDto(updatedWorkItem) : null;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        // Check if user is admin
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || user.ManageLevel != ManageLevel.Admin)
        {
            return false;
        }

        return await _workItemRepository.DeleteAsync(id);
    }

    public async Task<bool> AssignToUserAsync(AssignWorkItemDto assignDto, int adminUserId)
    {
        // Check if admin user is admin
        var adminUser = await _userRepository.GetByIdAsync(adminUserId);
        if (adminUser == null || adminUser.ManageLevel != ManageLevel.Admin)
        {
            return false;
        }

        // Check if work item exists
        var workItem = await _workItemRepository.GetByIdAsync(assignDto.WorkItemId);
        if (workItem == null)
        {
            return false;
        }

        // Check if user exists
        var user = await _userRepository.GetByIdAsync(assignDto.UserId);
        if (user == null)
        {
            return false;
        }

        // Check if assignment already exists
        var existingAssignment = await _userWorkItemRepository.GetByUserAndWorkItemAsync(assignDto.UserId, assignDto.WorkItemId);
        if (existingAssignment != null)
        {
            return false;
        }

        var userWorkItem = new UserWorkItem
        {
            UserId = assignDto.UserId,
            WorkItemId = assignDto.WorkItemId,
            Status = assignDto.Status
        };

        await _userWorkItemRepository.CreateAsync(userWorkItem);
        return true;
    }

    public async Task<bool> UpdateUserWorkItemStatusAsync(int userId, int workItemId, UpdateUserWorkItemDto updateDto)
    {
        var userWorkItem = await _userWorkItemRepository.GetByUserAndWorkItemAsync(userId, workItemId);
        if (userWorkItem == null)
        {
            return false;
        }

        userWorkItem.Status = updateDto.Status;
        var updated = await _userWorkItemRepository.UpdateAsync(userWorkItem);
        return updated != null;
    }

    public async Task<IEnumerable<WorkItemDto>> GetWorkItemsByUserIdAsync(int userId)
    {
        var userWorkItems = await _userWorkItemRepository.GetByUserIdAsync(userId);
        var workItems = userWorkItems.Select(uw => uw.WorkItem).ToList();
        return workItems.Select(MapToDto);
    }

    private static WorkItemDto MapToDto(WorkItem workItem)
    {
        return new WorkItemDto
        {
            Id = workItem.Id,
            Title = workItem.Title,
            Description = workItem.Description,
            CreatedTime = workItem.CreatedTime,
            Status = workItem.Status,
            LastUpdatedTime = workItem.LastUpdatedTime,
            AssignedUsers = workItem.UserWorkItems.Select(uw => new UserWorkItemDto
            {
                UserId = uw.UserId,
                WorkItemId = uw.WorkItemId,
                Status = uw.Status,
                User = new UserDto
                {
                    Id = uw.User.Id,
                    Username = uw.User.Username,
                    Email = uw.User.Email,
                    ManageLevel = uw.User.ManageLevel.ToString(),
                    CreatedAt = uw.User.CreatedAt,
                    UpdatedAt = uw.User.UpdatedAt,
                    LastLogin = uw.User.LastLogin
                }
            }).ToList()
        };
    }
}
