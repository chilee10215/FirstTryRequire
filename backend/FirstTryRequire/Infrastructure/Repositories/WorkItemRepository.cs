using Microsoft.EntityFrameworkCore;
using FirstTryRequire.Domain.Entities;
using FirstTryRequire.Domain.Interfaces;
using FirstTryRequire.Infrastructure.Data;

namespace FirstTryRequire.Infrastructure.Repositories;

public class WorkItemRepository : IWorkItemRepository
{
    private readonly ApplicationDbContext _context;

    public WorkItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<WorkItem?> GetByIdAsync(int id)
    {
        return await _context.WorkItems
            .Include(w => w.UserWorkItems)
            .ThenInclude(uw => uw.User)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<IEnumerable<WorkItem>> GetAllAsync()
    {
        return await _context.WorkItems
            .Include(w => w.UserWorkItems)
            .ThenInclude(uw => uw.User)
            .ToListAsync();
    }

    public async Task<WorkItem> CreateAsync(WorkItem workItem)
    {
        workItem.CreatedTime = DateTime.UtcNow;
        workItem.LastUpdatedTime = DateTime.UtcNow;

        _context.WorkItems.Add(workItem);
        await _context.SaveChangesAsync();
        return workItem;
    }

    public async Task<WorkItem?> UpdateAsync(WorkItem workItem)
    {
        var existingWorkItem = await _context.WorkItems.FindAsync(workItem.Id);
        if (existingWorkItem == null)
            return null;

        existingWorkItem.Title = workItem.Title;
        existingWorkItem.Description = workItem.Description;
        existingWorkItem.Status = workItem.Status;
        existingWorkItem.LastUpdatedTime = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingWorkItem;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var workItem = await _context.WorkItems.FindAsync(id);
        if (workItem == null)
            return false;

        _context.WorkItems.Remove(workItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.WorkItems.AnyAsync(w => w.Id == id);
    }
}
