﻿namespace EmployeeManagementSystem.DTOs
{
    public class EmployeeUpdateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        // ✅ Important: Add this property
        public bool ResetPassword { get; set; } = false;
    }
}
