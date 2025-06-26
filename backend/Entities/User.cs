
namespace EmployeeManagementSystem.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "Employee"; // Admin or Employee
        public bool IsActive { get; set; } = true;

        public Employee? Employee { get; set; }
        public string? Department { get; internal set; }
        public string? Position { get; internal set; }
        public bool IsApproved { get; set; } = false;     
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow; 

    }

}
