using Employee_project.Entity;
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SubmitReportAsync(int userId, ReportCreateDto dto)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null) throw new Exception("Employee not found");

            var report = new Report
            {
                EmployeeId = employee.Id,
                Title = dto.Title,
                Content = dto.Content,
                Type = dto.Type,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ReportResponseDto>> GetMyReportsAsync(int userId)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null) throw new Exception("Employee not found");

            return await _context.Reports
                .Where(r => r.EmployeeId == employee.Id)
                .Select(r => new ReportResponseDto
                {
                    ReportId = r.ReportId,
                    Title = r.Title,
                    Type = r.Type,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt,
                    Status = r.Status,
                    ReviewedAt = r.ReviewedAt.ToString(),
                    ReviewerName = r.ReviewerName,
                    Remarks = r.Remarks
                }).ToListAsync();
        }

        public async Task<List<ReportResponseDto>> GetAllReportsAsync()
        {
            return await _context.Reports
                .Include(r => r.Employee)
                .ThenInclude(e => e.User) // CORRECT
                .Select(r => new ReportResponseDto
                {
                    ReportId = r.ReportId,
                    Title = r.Title,
                    Type = r.Type,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt,
                    Status = r.Status,
                    ReviewedAt = r.ReviewedAt.ToString(),
                    ReviewerName = r.ReviewerName,
                    Remarks = r.Remarks
                }).ToListAsync();
        }


        public async Task UpdateReportStatusAsync(int reportId, string status, string reviewerName, string? remarks)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null) throw new Exception("Report not found");

            report.Status = status;
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewerName = reviewerName;
            report.Remarks = remarks;

            await _context.SaveChangesAsync();
        }
    }

}
