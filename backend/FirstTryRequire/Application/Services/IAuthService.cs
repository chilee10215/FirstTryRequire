using FirstTryRequire.Application.DTOs;

namespace FirstTryRequire.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<bool> UserExistsAsync(string username);
}
