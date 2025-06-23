using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Employee_project.Helpers
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            var smtpClient = new SmtpClient(_config["Email:SmtpServer"])
            {
                Port = int.Parse(_config["Email:Port"]!),
                Credentials = new NetworkCredential(
                    _config["Email:SenderEmail"],
                    _config["Email:SenderPassword"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Email:SenderEmail"]!),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);

            smtpClient.Send(mailMessage);
        }

        internal async Task SendPasswordResetEmailAsync(string email, string newPassword)
        {
            throw new NotImplementedException();
        }

        internal async Task SendWelcomeEmailAsync(string email, string password)
        {
            throw new NotImplementedException();
        }
    }
}
