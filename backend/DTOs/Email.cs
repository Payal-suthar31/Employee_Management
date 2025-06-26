using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class Email
    {
        [Required]
        public string email { get; set; }
    }
}
