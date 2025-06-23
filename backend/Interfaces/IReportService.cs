using EmployeeManagementSystem.DTOs;

namespace EmployeeManagementSystem.Interfaces
{
    public interface IReportService
    {
        Task SubmitReportAsync(int userId, ReportCreateDto dto);
        Task<List<ReportResponseDto>> GetMyReportsAsync(int userId);
        Task<List<ReportResponseDto>> GetAllReportsAsync();
        Task UpdateReportStatusAsync(int reportId, string status, string reviewerName, string? remarks);

    }
}
