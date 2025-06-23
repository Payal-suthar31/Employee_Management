namespace EmployeeManagementSystem.DTOs
{
    public class ReportResponseDto
    {
        public int ReportId { get; set; }
        public string Title { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
        public string? ReviewedAt { get; set; }
        public string? ReviewerName { get; set; }
        public string? Remarks { get; set; }
    }
}
