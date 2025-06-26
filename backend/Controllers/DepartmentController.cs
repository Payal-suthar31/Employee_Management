using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new { d.Id, d.Name })
                .ToListAsync();

            return Ok(departments);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddDepartment([FromBody] Department department)
        {
            if (string.IsNullOrWhiteSpace(department.Name))
                return BadRequest("Department name is required.");

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return Ok(department);
        }
     
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null)
                return NotFound("Department not found.");

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return Ok("Department deleted successfully.");
        }

        [HttpGet("dashboard-count")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var activeEmployees = await _context.Employees.CountAsync(e => e.IsActive);
            var departmentCount = await _context.Departments.CountAsync();
            var reportCount = await _context.Reports.CountAsync();

            return Ok(new
            {
                activeEmployees,
                departmentCount,
                reportCount
            });
        }
    }
}
