using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> SubmitReport(ReportCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        await _reportService.SubmitReportAsync(userId, dto);
        return Ok(new { message = "Report submitted" });
    }
    [HttpGet("my")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMyReports()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");

        var userId = int.Parse(userIdClaim.Value);
        var reports = await _reportService.GetMyReportsAsync(userId);
        return Ok(reports);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllReports()
    {
        var reports = await _reportService.GetAllReportsAsync();
        return Ok(reports);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var reviewer = User.FindFirst(ClaimTypes.Email)?.Value ?? "Admin";
        await _reportService.UpdateReportStatusAsync(id, dto.Status, reviewer, dto.Remarks);
        return Ok(new { message = "Report status updated" });
    }
}
