using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;

namespace EmployeeManagementSystem.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync();
        Task<EmployeeResponseDto> GetOwnProfileAsync(int userId);
        Task UpdateOwnProfileAsync(int userId, EmployeeUpdateDto dto);
        Task UpdateEmployeeAsync(int id, EmployeeUpdateDto dto);
        Task ResetEmployeePasswordAsync(int id);
        Task DeleteEmployeeAsync(int id);
        Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto);
        Task<IEnumerable<EmployeeResponseDto>> GetEmployeesByDepartmentAsync(string departmentName);


    }
}
