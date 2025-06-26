using Microsoft.AspNetCore.Http;

namespace EmployeeManagementSystem.Interfaces
{
    public interface ICloudinaryService
    {
        Task<string> UploadDocumentAsync(IFormFile file);
    }
}
