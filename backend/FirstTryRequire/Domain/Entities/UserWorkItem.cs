namespace FirstTryRequire.Domain.Entities;

public class UserWorkItem
{
    public int UserId { get; set; }
    public int WorkItemId { get; set; }
    public string Status { get; set; } = string.Empty;

    // Navigation properties
    public User User { get; set; } = null!;
    public WorkItem WorkItem { get; set; } = null!;
}

public enum UserWorkItemStatus
{
    Assigned,
    InProgress,
    Completed,
    Rejected
}
