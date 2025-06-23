using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EmployeeManagementSystem.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync()
        {
            return await _context.Employees.Select(e => new EmployeeResponseDto
            {
                Id = e.Id,
                FullName = e.FullName,
                Email = e.Email,
                Department = e.Department,
                Position = e.Position,
                DateOfJoining = e.DateOfJoining
            }).ToListAsync();
        }

        public async Task<EmployeeResponseDto> GetOwnProfileAsync(int userId)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null) throw new Exception("Employee not found");

            return new EmployeeResponseDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Email = employee.Email,
                Department = employee.Department,
                Position = employee.Position,
                DateOfJoining = employee.DateOfJoining
            };
        }

        public async Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto)
        {
            // Add User
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = dto.Role ?? "Employee",
                Department = dto.Department,
                Position = dto.Position
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Add Employee
            var employee = new Employee
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = "", // no longer used
                Department = dto.Department,
                Position = dto.Position,
                Role = dto.Role ?? "Employee",
                DateOfJoining = DateTime.UtcNow,
                UserId = user.Id
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return new EmployeeResponseDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Email = employee.Email,
                Department = employee.Department,
                Position = employee.Position,
                DateOfJoining = employee.DateOfJoining
            };
        }

        public async Task UpdateOwnProfileAsync(int userId, EmployeeUpdateDto dto)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null) throw new Exception("Employee not found");

            employee.FullName = dto.FullName;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.Position = dto.Position;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(int id, EmployeeUpdateDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) throw new Exception("Employee not found");

            employee.FullName = dto.FullName;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.Position = dto.Position;

            await _context.SaveChangesAsync();
        }

        public async Task ResetEmployeePasswordAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) throw new Exception("Employee not found");

            var user = await _context.Users.FindAsync(employee.UserId);
            if (user == null) throw new Exception("User not found");

            var newPassword = Guid.NewGuid().ToString().Substring(0, 8);
            user.PasswordHash = HashPassword(newPassword);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) throw new Exception("Employee not found");

            var user = await _context.Users.FindAsync(employee.UserId);
            if (user != null) _context.Users.Remove(user);

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }

        // Utility method
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        public async Task<IEnumerable<EmployeeResponseDto>> GetEmployeesByDepartmentAsync(string departmentName)
{
    return await _context.Employees
        .Where(e => e.Department == departmentName)
        .Select(e => new EmployeeResponseDto
        {
            Id = e.Id,
            FullName = e.FullName,
            Email = e.Email,
            Department = e.Department,
            Position = e.Position,
            DateOfJoining = e.DateOfJoining
        })
        .ToListAsync();
}

    }
}
