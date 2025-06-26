namespace EmployeeManagementSystem.DTOs
{
   
        public class CreateEmployeeDto
        {
            public string FullName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Department { get; set; } = null!;
            public string Position { get; set; } = null!;
            public DateTime DateOfJoining { get; set; }
            public int UserId { get; set; }
            public string Password { get; set; } = null!;
            public string? Role { get; set; } = "Employee";
        }


        public class UpdateEmployeeDto
        {
            public string FullName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Department { get; set; } = null!;
            public string Position { get; set; } = null!;
            public bool IsActive { get; set; }
            public bool ResetPassword { get; set; } = false;
            public string? Password { get; set; }
        }


        public class EmployeeResponseDto
        {
            public int Id { get; set; }
            public string FullName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Department { get; set; } = null!;
            public string Position { get; set; } = null!;
            public DateTime DateOfJoining { get; set; }
            public string Role { get; set; } = "Employee";
            public int UserId { get; set; }
            public bool IsActive { get; set; }
        }
    }
