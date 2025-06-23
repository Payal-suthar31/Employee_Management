namespace EmployeeManagementSystem.DTOs
{
    public class ReportCreateDto
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Type { get; set; } = null!; // Daily/Weekly/Monthly
    }
}
