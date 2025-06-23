using EmployeeManagementSystem.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Employee_project.Entity
{
    public class Report
    {
        public int ReportId { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewerName { get; set; }
        public string? Remarks { get; set; }

        public int EmployeeId { get; set; }              // ✅ FK
        public Employee Employee { get; set; }
    }
}
