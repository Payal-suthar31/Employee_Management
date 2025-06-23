namespace EmployeeManagementSystem.DTOs
{
    public class EmployeeCreateDto
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Department { get; set; }
        public required string Position { get; set; }
        public string? Role { get; set; }
    }
}