using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly AppDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;

        public ReportController(IReportService reportService, AppDbContext context, ICloudinaryService cloudinaryService)
        {
            _reportService = reportService;
            _context = context;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _reportService.GetAllReportsAsync();
            return Ok(reports);
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> SubmitReport([FromForm] ReportCreateDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                string? documentUrl = null;

                if (dto.Document != null)
                {
                    try
                    {
                        documentUrl = await _cloudinaryService.UploadDocumentAsync(dto.Document);
                        dto.DocumentUrl = documentUrl;
                    }
                    catch (Exception ex)
                    {
                        return BadRequest($"Failed to upload document: {ex.Message}");
                    }
                }

                await _reportService.SubmitReportAsync(userId, dto);
                return Ok(new { message = "Report submitted successfully", documentUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to submit report", error = ex.Message });
            }
        }

        [HttpGet("my")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetMyReports()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var reports = await _reportService.GetReportsByUserIdAsync(userId);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Failed to fetch reports",
                    details = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }

        [HttpGet("{id}/document")]
        [Authorize]
        public async Task<IActionResult> GetDocument(int id)
        {
            try
            {
                var report = await _context.Reports.FindAsync(id);
                if (report == null)
                    return NotFound("Report not found");

                if (string.IsNullOrEmpty(report.DocumentPath))
                    return NotFound("Document not found");

                // If it's already a full URL, return it directly
                if (report.DocumentPath.StartsWith("http"))
                    return Ok(new { url = report.DocumentPath });

                // Otherwise, construct the full URL
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var fullUrl = $"{baseUrl}/api/Report/document/{id}";
                
                return Ok(new { url = fullUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateReportStatus(int id, [FromBody] ReportStatusUpdateDto dto)
        {
            try
            {
                await _reportService.UpdateReportStatusAsync(id, dto.Status);
                return Ok(new { message = "Report status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("employee-stats/{employeeId}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> GetEmployeeReportStats(int employeeId)
        {
            var total = await _context.Reports.CountAsync(r => r.EmployeeId == employeeId);
            var pending = await _context.Reports.CountAsync(r => r.EmployeeId == employeeId && r.Status == "Pending");
            var approved = await _context.Reports.CountAsync(r => r.EmployeeId == employeeId && r.Status == "Approved");
            var rejected = await _context.Reports.CountAsync(r => r.EmployeeId == employeeId && r.Status == "Rejected");

            return Ok(new { total, pending, approved, rejected });
        }

        [HttpPost("approve/{reportId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveReport(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return NotFound("Report not found.");

            report.Status = "Approved";
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewerName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";

            await _context.SaveChangesAsync();
            return Ok("Report approved successfully.");
        }

        [HttpPost("reject/{reportId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectReport(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return NotFound("Report not found.");

            report.Status = "Rejected";
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewerName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";

            await _context.SaveChangesAsync();
            return Ok("Report rejected successfully.");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            try
            {
                var report = await _context.Reports.FindAsync(id);
                if (report == null)
                    return NotFound("Report not found.");

                _context.Reports.Remove(report);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Report deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete report", error = ex.Message });
            }
        }
    }
}
