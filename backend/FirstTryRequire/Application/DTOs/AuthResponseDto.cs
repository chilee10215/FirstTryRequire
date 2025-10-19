namespace FirstTryRequire.Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string ManageLevel { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
