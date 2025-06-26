namespace EmployeeManagementSystem.DTOs
{
   
        public class ReportCreateDto
        {
            public string Title { get; set; } = null!;
            public string Type { get; set; } = null!;
            public string Content { get; set; } = null!;
            public IFormFile? Document { get; set; }
            public string? DocumentUrl { get; set; }
        }

        public class ReportStatusUpdateDto
        {
            public string Status { get; set; } = null!;
            public string? Remarks { get; set; }
        }

        public class ReportResponseDto
        {
            public int ReportId { get; set; }
            public string? Title { get; set; }
            public string? Type { get; set; }
            public string? Content { get; set; }
            public string? Status { get; set; }
            public string? ReviewedAt { get; set; }
            public string? ReviewerName { get; set; }
            public string? Remarks { get; set; }
            public DateTime CreatedAt { get; set; }
            public string? DocumentPath { get; set; }
            public string? DocumentUrl { get { return DocumentPath; } }
            public string? EmployeeName { get; set; }
        }
    }
