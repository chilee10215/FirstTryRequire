namespace FirstTryRequire.Domain.Entities;

public class WorkItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime LastUpdatedTime { get; set; }

    // Navigation property for many-to-many relationship
    public ICollection<UserWorkItem> UserWorkItems { get; set; } = new List<UserWorkItem>();
}

public enum WorkItemStatus
{
    Pending,
    InProgress,
    Completed,
    Cancelled
}
