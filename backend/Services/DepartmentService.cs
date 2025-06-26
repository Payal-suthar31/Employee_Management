using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
   
        public class DepartmentService : IDepartmentService
        {
            private readonly AppDbContext _context;

            public DepartmentService(AppDbContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
            {
                return await _context.Departments
                    .Select(d => new Department
                    {
                        Id = d.Id,
                        Name = d.Name
                    })
                    .ToListAsync();
            }
        }
}
