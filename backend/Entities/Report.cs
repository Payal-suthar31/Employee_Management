using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagementSystem.Entities
{
    public class Report
    {
        public int ReportId { get; set; }
        public string Title { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? DocumentPath { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewerName { get; set; }
        public string? Remarks { get; set; }

        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }

        public Employee Employee { get; set; } = null!;
    }
}
