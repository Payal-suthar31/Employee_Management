using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;

namespace EmployeeManagementSystem.Interfaces
{
    public interface IReportService
    {
        Task SubmitReportAsync(int userId, ReportCreateDto dto);
        Task<List<ReportResponseDto>> GetMyReportsAsync(int userId);
        Task<List<ReportResponseDto>> GetAllReportsAsync();
        Task<IEnumerable<ReportResponseDto>> GetReportsByUserIdAsync(int userId);
        Task UpdateReportStatusAsync(int reportId, string status, string reviewerName, string? remarks);
        Report? GetReportById(int id);
        Task UpdateReportStatusAsync(int id, string status);
    }
}
