using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Entities;
using EmployeeManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;

        public ReportService(AppDbContext context, ICloudinaryService cloudinaryService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        // 1. Employee submits a report (with or without document)
        public async Task SubmitReportAsync(int userId, ReportCreateDto dto)
        {
            Console.WriteLine($"[SubmitReport] Checking User ID: {userId}");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception($"User with ID {userId} not found.");

            if (user.Role?.ToLower() != "employee")
                throw new Exception("Only users with role 'Employee' can submit reports.");

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == userId);
            if (employee == null)
                throw new Exception($"No employee found linked with User ID: {userId}");

            Console.WriteLine($"[SubmitReport] Found Employee: {employee.FullName} (ID: {employee.Id})");

            var report = new Report
            {
                EmployeeId = employee.Id,
                Title = dto.Title,
                Type = dto.Type,
                Content = dto.Content,
                DocumentPath = dto.DocumentUrl,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            try
            {
                await _context.Reports.AddAsync(report);
                await _context.SaveChangesAsync();
                Console.WriteLine("[SubmitReport] Report submitted successfully.");
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"[SubmitReport] Error: {ex.Message}");
                throw new Exception($"Database error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // 2. Get logged-in employee's reports
        public async Task<List<ReportResponseDto>> GetMyReportsAsync(int userId)
        {
            var employee = await _context.Employees
                .Include(e => e.Reports)
                .FirstOrDefaultAsync(e => e.UserId == userId);

            if (employee == null)
                return new List<ReportResponseDto>();

            return employee.Reports.Select(r => new ReportResponseDto
            {
                ReportId = r.ReportId,
                Title = r.Title,
                Type = r.Type,
                Content = r.Content,
                CreatedAt = r.CreatedAt,
                Status = r.Status,
                ReviewedAt = r.ReviewedAt?.ToString("yyyy-MM-dd HH:mm"),
                ReviewerName = r.ReviewerName,
                Remarks = r.Remarks,
                DocumentPath = r.DocumentPath
            }).ToList();
        }

        // 3. Admin gets all reports
        public async Task<List<ReportResponseDto>> GetAllReportsAsync()
        {
            var reports = await _context.Reports
            .Include(r => r.Employee)
            .ToListAsync(); 

            return reports.Select(r => new ReportResponseDto
            {
                ReportId = r.ReportId,
                Title = r.Title,
                Type = r.Type,
                Content = r.Content,
                CreatedAt = r.CreatedAt,
                Status = r.Status,
                ReviewedAt = r.ReviewedAt?.ToString("yyyy-MM-dd HH:mm"), 
                ReviewerName = r.ReviewerName,
                Remarks = r.Remarks,
                DocumentPath = r.DocumentPath,
                EmployeeName = r.Employee.FullName
            }).ToList();

        }

        // 4. Get reports by user ID
        public async Task<IEnumerable<ReportResponseDto>> GetReportsByUserIdAsync(int userId)
        {
            var employee = await _context.Employees
                .Include(e => e.Reports)
                .FirstOrDefaultAsync(e => e.UserId == userId);

            if (employee == null)
                return Enumerable.Empty<ReportResponseDto>();

            return employee.Reports.Select(r => new ReportResponseDto
            {
                ReportId = r.ReportId,
                Title = r.Title,
                Type = r.Type,
                Content = r.Content,
                CreatedAt = r.CreatedAt,
                Status = r.Status,
                ReviewedAt = r.ReviewedAt?.ToString("yyyy-MM-dd HH:mm"),
                ReviewerName = r.ReviewerName,
                Remarks = r.Remarks,
                DocumentPath = r.DocumentPath
            });
        }

        // 5. Admin updates report status (with remarks and reviewer name)
        public async Task UpdateReportStatusAsync(int reportId, string status, string reviewerName, string? remarks)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                throw new Exception("Report not found");

            report.Status = status;
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewerName = reviewerName;
            report.Remarks = remarks;

            await _context.SaveChangesAsync();
        }

        // 6. Get report by ID (for download/view)
        public Report? GetReportById(int id)
        {
            return _context.Reports.FirstOrDefault(r => r.ReportId == id);
        }

        // Optional: Update status with no remarks
        public async Task UpdateReportStatusAsync(int reportId, string status)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                throw new Exception("Report not found");

            report.Status = status;
            report.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
