using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
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
        try
        {
            var (token, role) = await _userService.LoginAsync(dto);
            return Ok(new { token, role });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
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


    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] Email dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Email == dto.email);

        if (!userExists)
            return NotFound(new { message = "Email not found" });

        return Ok(new { message = "Email verified" });
    }

    // Get all pending users
    [HttpGet("pending-requests")]
    public async Task<IActionResult> GetPendingUsers()
    {
        var users = await _context.Users
            .Where(u => u.Role == "Employee" && u.IsApproved == false)
            .ToListAsync();

        return Ok(users);
    }

    // Approve a user
    [HttpPost("approve-user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveUser(int id, [FromBody] ApproveUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound("User not found");

        if (user.IsApproved)
            return BadRequest("User is already approved");

        var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == user.Id);
        if (existingEmployee != null)
            return BadRequest("An employee with this user already exists.");

        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Name == dto.Department);
        if (department == null)
            return BadRequest("Department not found.");

        user.IsApproved = true;

        var employee = new Employee
        {
            FullName = user.FullName,
            Email = user.Email,
            Department = department.Name,
            Position = dto.Position,
            DateOfJoining = DateTime.UtcNow,
            IsActive = true,
            UserId = user.Id
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok("User approved and added as employee.");
    }

    [HttpPost("admin-add-employee")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddEmployeeByAdmin([FromBody] CreateEmployeeDto dto)
    {
        // 1. Check for duplicate email
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (existingUser != null)
            return BadRequest("User with this email already exists.");

        // 2. Hash password and create user
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = hashedPassword,
            Role = "Employee",
            IsApproved = true
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync(); // Save to get UserId

        // 3. Validate department
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Name == dto.Department);
        if (department == null)
            return BadRequest("Department not found.");

        // 4. Create Employee
        var employee = new Employee
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Department = department.Name,
            Position = dto.Position,
            DateOfJoining = DateTime.UtcNow,
            IsActive = true,
            UserId = user.Id
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok("Employee added successfully by admin.");
    }

    // Reject a user
    [HttpPost("reject-user/{id}")]
    public async Task<IActionResult> RejectUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("User rejected and removed");
    }

}


