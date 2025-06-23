namespace EmployeeManagementSystem.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string email, string password);
        Task SendPasswordResetEmailAsync(string email, string newPassword);
    }
}
