using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Interfaces
{
    public interface IUserService
    {
        Task<string> RegisterAsync(RegisterDto dto);
        Task<(string Token, string Role)> LoginAsync(LoginDto dto);
        Task<UserResponseDto> GetUserProfileAsync(int userId);
    }
}
