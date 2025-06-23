namespace EmployeeManagementSystem.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Department { get; set; } = null!;
        public string Position { get; set; } = null!;
    }

}
