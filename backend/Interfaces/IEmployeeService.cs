using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync();
        Task<EmployeeResponseDto> GetOwnProfileAsync(int userId);
        Task UpdateOwnProfileAsync(int userId, UpdateEmployeeDto dto);
        Task UpdateEmployeeAsync(int id, UpdateEmployeeDto dto);
        Task ResetEmployeePasswordAsync(int id);
        Task DeleteEmployeeAsync(int id);
        Task<EmployeeResponseDto> CreateEmployeeAsync(CreateEmployeeDto dto);
        Task<IEnumerable<EmployeeResponseDto>> GetEmployeesByDepartmentAsync(string departmentName);


    }
}
