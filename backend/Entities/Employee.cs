namespace EmployeeManagementSystem.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string Role { get; set; } = "Employee";  
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public bool IsActive { get; set; } = true; 

    }

}
