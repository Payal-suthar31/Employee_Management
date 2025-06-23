namespace EmployeeManagementSystem.DTOs
{
    public class UpdateStatusDto
    {
        public string Status { get; set; } = null!; // Approved, Rejected, Pending
        public string? Remarks { get; set; }
    }
}
