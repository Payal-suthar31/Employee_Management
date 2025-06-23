
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]

public class AccountController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly AppDbContext _context;

    public AccountController(IUserService userService, AppDbContext context)
    {
        _userService = userService;
        _context = context;
    }
  
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var token = await _userService.RegisterAsync(dto);
        return Ok(new { Token = token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var (token, role) = await _userService.LoginAsync(dto);
        return Ok(new { token, role });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        int userId;
        try
        {
            userId = GetUserIdFromClaims();
        }
        catch (Exception)
        {
            return Unauthorized();
        }

        var userProfile = await _userService.GetUserProfileAsync(userId);

        if (userProfile == null)
            return NotFound();

        return Ok(userProfile);
    }

    private int GetUserIdFromClaims()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new Exception("User Id claim not found.");

        return int.Parse(userIdClaim.Value);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return NotFound("User not found");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok("Password reset successful");
    }

}


