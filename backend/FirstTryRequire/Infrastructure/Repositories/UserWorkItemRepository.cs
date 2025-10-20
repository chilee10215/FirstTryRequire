using Microsoft.EntityFrameworkCore;
using FirstTryRequire.Domain.Entities;
using FirstTryRequire.Domain.Interfaces;
using FirstTryRequire.Infrastructure.Data;

namespace FirstTryRequire.Infrastructure.Repositories;

public class UserWorkItemRepository : IUserWorkItemRepository
{
    private readonly ApplicationDbContext _context;

    public UserWorkItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserWorkItem?> GetByUserAndWorkItemAsync(int userId, int workItemId)
    {
        return await _context.UserWorkItems
            .Include(uw => uw.User)
            .Include(uw => uw.WorkItem)
            .FirstOrDefaultAsync(uw => uw.UserId == userId && uw.WorkItemId == workItemId);
    }

    public async Task<IEnumerable<UserWorkItem>> GetByUserIdAsync(int userId)
    {
        return await _context.UserWorkItems
            .Include(uw => uw.WorkItem)
            .Where(uw => uw.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserWorkItem>> GetByWorkItemIdAsync(int workItemId)
    {
        return await _context.UserWorkItems
            .Include(uw => uw.User)
            .Where(uw => uw.WorkItemId == workItemId)
            .ToListAsync();
    }

    public async Task<UserWorkItem> CreateAsync(UserWorkItem userWorkItem)
    {
        _context.UserWorkItems.Add(userWorkItem);
        await _context.SaveChangesAsync();
        return userWorkItem;
    }

    public async Task<UserWorkItem?> UpdateAsync(UserWorkItem userWorkItem)
    {
        var existingUserWorkItem = await _context.UserWorkItems
            .FirstOrDefaultAsync(uw => uw.UserId == userWorkItem.UserId && uw.WorkItemId == userWorkItem.WorkItemId);

        if (existingUserWorkItem == null)
            return null;

        existingUserWorkItem.Status = userWorkItem.Status;
        await _context.SaveChangesAsync();
        return existingUserWorkItem;
    }

    public async Task<bool> DeleteAsync(int userId, int workItemId)
    {
        var userWorkItem = await _context.UserWorkItems
            .FirstOrDefaultAsync(uw => uw.UserId == userId && uw.WorkItemId == workItemId);

        if (userWorkItem == null)
            return false;

        _context.UserWorkItems.Remove(userWorkItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int userId, int workItemId)
    {
        return await _context.UserWorkItems
            .AnyAsync(uw => uw.UserId == userId && uw.WorkItemId == workItemId);
    }
}
