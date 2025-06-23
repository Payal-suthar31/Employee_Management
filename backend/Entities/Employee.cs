using Employee_project.Entity;

namespace EmployeeManagementSystem.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }  // Will store hashed password
        public string Department { get; set; }
        public string Position { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string Role { get; set; } = "Employee";  // Default role
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public ICollection<Report> Reports { get; set; } = new List<Report>();

    }

}
