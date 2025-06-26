namespace EmployeeManagementSystem.DTOs
{
        public class LoginDto
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }


        public class RegisterDto
        {
            public string FullName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
            public string Role { get; set; } = "Employee";
        }


        public class ApproveUserDto
        {
            public string Department { get; set; } = null!;
            public string Position { get; set; } = null!;
        }


        public class ResetPasswordDto
        {
            public string Email { get; set; } = null!;
            public string NewPassword { get; set; } = null!;
        }


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

