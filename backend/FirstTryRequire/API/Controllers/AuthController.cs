using Microsoft.AspNetCore.Mvc;
using FirstTryRequire.Application.DTOs;
using FirstTryRequire.Application.Services;

namespace FirstTryRequire.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Username}", loginDto.Username);
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists
            var userExists = await _authService.UserExistsAsync(registerDto.Username);
            if (userExists)
            {
                return Conflict(new { message = "Username is already taken" });
            }

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
            {
                return BadRequest(new { message = "Failed to create user" });
            }

            return CreatedAtAction(nameof(Register), result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for user {Username}", registerDto.Username);
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpGet("check-username/{username}")]
    public async Task<ActionResult> CheckUsername(string username)
    {
        try
        {
            var exists = await _authService.UserExistsAsync(username);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking username {Username}", username);
            return StatusCode(500, new { message = "An error occurred while checking username" });
        }
    }
}
