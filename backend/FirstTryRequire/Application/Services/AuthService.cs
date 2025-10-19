using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using FirstTryRequire.Application.DTOs;
using FirstTryRequire.Domain.Entities;
using FirstTryRequire.Domain.Interfaces;

namespace FirstTryRequire.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByUsernameAsync(loginDto.Username);
        if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            return null;
        }

        // Update last login
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var token = GenerateJwtToken(user);
        var expiresAt = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            ManageLevel = user.ManageLevel.ToString(),
            ExpiresAt = expiresAt
        };
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByUsernameAsync(registerDto.Username);
        if (existingUser != null)
        {
            return null; // User already exists
        }

        // Create new user
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = HashPassword(registerDto.Password),
            ManageLevel = ManageLevel.Worker, // Always set to Worker as requested
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.CreateAsync(user);
        var token = GenerateJwtToken(createdUser);
        var expiresAt = DateTime.UtcNow.AddHours(24); // Token expires in 24 hours

        return new AuthResponseDto
        {
            Token = token,
            Username = createdUser.Username,
            ManageLevel = createdUser.ManageLevel.ToString(),
            ExpiresAt = expiresAt
        };
    }

    public async Task<bool> UserExistsAsync(string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        return user != null;
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
        var issuer = jwtSettings["Issuer"] ?? "FirstTryRequire";
        var audience = jwtSettings["Audience"] ?? "FirstTryRequireUsers";
        var expiresInHours = int.Parse(jwtSettings["ExpiresInHours"] ?? "24");

        var key = Encoding.ASCII.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.ManageLevel.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(expiresInHours),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private static bool VerifyPassword(string password, string hashedPassword)
    {
        var hashedInput = HashPassword(password);
        return hashedInput == hashedPassword;
    }
}
