using Microsoft.AspNetCore.Mvc;
using FirstTryRequire.Application.UseCases;
using FirstTryRequire.Application.DTOs;

namespace FirstTryRequire.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GetUserUseCase _getUserUseCase;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        GetUserUseCase getUserUseCase,
        ILogger<UsersController> logger)
    {
        _getUserUseCase = getUserUseCase;
        _logger = logger;
    }

    /// <summary>
    /// Get a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            _logger.LogInformation("Getting user with ID: {UserId}", id);
            
            var user = await _getUserUseCase.ExecuteAsync(id);
            
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", id);
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            _logger.LogInformation("Successfully retrieved user with ID: {UserId}", id);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting user with ID: {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }
}

