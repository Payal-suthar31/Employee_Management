using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

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
                DateOfJoining = e.DateOfJoining,
                Role = e.Role,
                UserId = e.UserId,
                IsActive = e.IsActive
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
                DateOfJoining = employee.DateOfJoining,
                Role = employee.Role,
                UserId = employee.UserId,
                IsActive = employee.IsActive
            };
        }

        public async Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto dto)
        {
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = dto.Role ?? "Employee",
                Department = dto.Department,
                Position = dto.Position,
                IsApproved = true
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var employee = new Employee
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Department = dto.Department,
                Position = dto.Position,
                Role = dto.Role ?? "Employee",
                DateOfJoining = dto.DateOfJoining,
                UserId = user.Id,
                IsActive = true
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
                DateOfJoining = employee.DateOfJoining,
                Role = employee.Role,
                UserId = employee.UserId,
                IsActive = employee.IsActive
            };
        }

        public async Task UpdateOwnProfileAsync(int userId, UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null) throw new Exception("Employee not found");

            employee.FullName = dto.FullName;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.Position = dto.Position;
            employee.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(int id, UpdateEmployeeDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) throw new Exception("Employee not found");

            employee.FullName = dto.FullName;
            employee.Email = dto.Email;
            employee.Department = dto.Department;
            employee.Position = dto.Position;
            employee.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            if (dto.ResetPassword)
            {
                var user = await _context.Users.FindAsync(employee.UserId);
                if (user != null && !string.IsNullOrWhiteSpace(dto.Password))
                {
                    user.PasswordHash = HashPassword(dto.Password);
                    await _context.SaveChangesAsync();
                }
            }
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
                    DateOfJoining = e.DateOfJoining,
                    Role = e.Role,
                    UserId = e.UserId,
                    IsActive = e.IsActive
                })
                .ToListAsync();
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
