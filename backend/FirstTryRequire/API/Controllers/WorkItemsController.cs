using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FirstTryRequire.Application.DTOs;
using FirstTryRequire.Application.Services;

namespace FirstTryRequire.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkItemsController : ControllerBase
{
    private readonly IWorkItemService _workItemService;
    private readonly ILogger<WorkItemsController> _logger;

    public WorkItemsController(
        IWorkItemService workItemService,
        ILogger<WorkItemsController> logger)
    {
        _workItemService = workItemService;
        _logger = logger;
    }

    /// <summary>
    /// Get all work items
    /// </summary>
    /// <returns>List of work items</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<WorkItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllWorkItems()
    {
        try
        {
            _logger.LogInformation("Getting all work items");

            var workItems = await _workItemService.GetAllAsync();

            _logger.LogInformation("Successfully retrieved {Count} work items", workItems.Count());
            return Ok(workItems);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all work items");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get a work item by ID
    /// </summary>
    /// <param name="id">Work item ID</param>
    /// <returns>Work item details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(WorkItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetWorkItem(int id)
    {
        try
        {
            _logger.LogInformation("Getting work item with ID: {WorkItemId}", id);

            var workItem = await _workItemService.GetByIdAsync(id);

            if (workItem == null)
            {
                _logger.LogWarning("Work item with ID {WorkItemId} not found", id);
                return NotFound(new { message = $"Work item with ID {id} not found" });
            }

            _logger.LogInformation("Successfully retrieved work item with ID: {WorkItemId}", id);
            return Ok(workItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting work item with ID: {WorkItemId}", id);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Create a new work item (Admin only)
    /// </summary>
    /// <param name="createDto">Work item creation data</param>
    /// <returns>Created work item</returns>
    [HttpPost]
    [ProducesResponseType(typeof(WorkItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateWorkItem([FromBody] CreateWorkItemDto createDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Creating work item: {Title} by user {UserId}", createDto.Title, userId);

            var workItem = await _workItemService.CreateAsync(createDto, userId.Value);

            if (workItem == null)
            {
                _logger.LogWarning("Failed to create work item: {Title} by user {UserId} - insufficient permissions", createDto.Title, userId);
                return Forbid("Only administrators can create work items");
            }

            _logger.LogInformation("Successfully created work item with ID: {WorkItemId}", workItem.Id);
            return CreatedAtAction(nameof(GetWorkItem), new { id = workItem.Id }, workItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating work item: {Title}", createDto.Title);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Update a work item (Admin only)
    /// </summary>
    /// <param name="id">Work item ID</param>
    /// <param name="updateDto">Work item update data</param>
    /// <returns>Updated work item</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(WorkItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateWorkItem(int id, [FromBody] UpdateWorkItemDto updateDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Updating work item {WorkItemId} by user {UserId}", id, userId);

            var workItem = await _workItemService.UpdateAsync(id, updateDto, userId.Value);

            if (workItem == null)
            {
                _logger.LogWarning("Failed to update work item {WorkItemId} by user {UserId} - insufficient permissions or not found", id, userId);
                return NotFound(new { message = "Work item not found or insufficient permissions" });
            }

            _logger.LogInformation("Successfully updated work item with ID: {WorkItemId}", id);
            return Ok(workItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating work item {WorkItemId}", id);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Delete a work item (Admin only)
    /// </summary>
    /// <param name="id">Work item ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteWorkItem(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Deleting work item {WorkItemId} by user {UserId}", id, userId);

            var success = await _workItemService.DeleteAsync(id, userId.Value);

            if (!success)
            {
                _logger.LogWarning("Failed to delete work item {WorkItemId} by user {UserId} - insufficient permissions or not found", id, userId);
                return NotFound(new { message = "Work item not found or insufficient permissions" });
            }

            _logger.LogInformation("Successfully deleted work item with ID: {WorkItemId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting work item {WorkItemId}", id);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Assign a work item to a user (Admin only)
    /// </summary>
    /// <param name="assignDto">Assignment data</param>
    /// <returns>Success status</returns>
    [HttpPost("assign")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AssignWorkItem([FromBody] AssignWorkItemDto assignDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Assigning work item {WorkItemId} to user {TargetUserId} by admin {AdminUserId}",
                assignDto.WorkItemId, assignDto.UserId, userId);

            var success = await _workItemService.AssignToUserAsync(assignDto, userId.Value);

            if (!success)
            {
                _logger.LogWarning("Failed to assign work item {WorkItemId} to user {TargetUserId} by admin {AdminUserId}",
                    assignDto.WorkItemId, assignDto.UserId, userId);
                return BadRequest(new { message = "Failed to assign work item. Check permissions and data validity." });
            }

            _logger.LogInformation("Successfully assigned work item {WorkItemId} to user {TargetUserId}",
                assignDto.WorkItemId, assignDto.UserId);
            return Ok(new { message = "Work item assigned successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while assigning work item {WorkItemId} to user {TargetUserId}",
                assignDto.WorkItemId, assignDto.UserId);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Update user work item status
    /// </summary>
    /// <param name="workItemId">Work item ID</param>
    /// <param name="updateDto">Status update data</param>
    /// <returns>Success status</returns>
    [HttpPut("{workItemId}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateUserWorkItemStatus(int workItemId, [FromBody] UpdateUserWorkItemDto updateDto)
    {
        var userId = GetCurrentUserId();
        try
        {
            //var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Updating work item {WorkItemId} status to {Status} by user {UserId}",
                workItemId, updateDto.Status, userId);

            var success = await _workItemService.UpdateUserWorkItemStatusAsync(userId.Value, workItemId, updateDto);

            if (!success)
            {
                _logger.LogWarning("Failed to update work item {WorkItemId} status by user {UserId}", workItemId, userId);
                return NotFound(new { message = "Work item assignment not found" });
            }

            _logger.LogInformation("Successfully updated work item {WorkItemId} status by user {UserId}", workItemId, userId);
            return Ok(new { message = "Work item status updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating work item {WorkItemId} status by user {UserId}",
                workItemId, userId);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get work items assigned to current user
    /// </summary>
    /// <returns>List of assigned work items</returns>
    [HttpGet("my-work-items")]
    [ProducesResponseType(typeof(IEnumerable<WorkItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMyWorkItems()
    {
        var userId = GetCurrentUserId();
        try
        {
            //var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            _logger.LogInformation("Getting work items for user {UserId}", userId);

            var workItems = await _workItemService.GetWorkItemsByUserIdAsync(userId.Value);

            _logger.LogInformation("Successfully retrieved {Count} work items for user {UserId}", workItems.Count(), userId);
            return Ok(workItems);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting work items for user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : null;
    }
}
