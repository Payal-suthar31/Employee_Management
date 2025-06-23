namespace EmployeeManagementSystem.DTOs
{
    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Department { get; set; } = null!;
        public string Position { get; set; } = null!;
        public DateTime DateOfJoining { get; set; }
    }
}
