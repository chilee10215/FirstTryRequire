namespace FirstTryRequire.Application.DTOs;

public class WorkItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime LastUpdatedTime { get; set; }
    public List<UserWorkItemDto> AssignedUsers { get; set; } = new();
}

public class CreateWorkItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Pending";
}

public class UpdateWorkItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class UserWorkItemDto
{
    public int UserId { get; set; }
    public int WorkItemId { get; set; }
    public string Status { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class AssignWorkItemDto
{
    public int UserId { get; set; }
    public int WorkItemId { get; set; }
    public string Status { get; set; } = "Assigned";
}

public class UpdateUserWorkItemDto
{
    public string Status { get; set; } = string.Empty;
}
