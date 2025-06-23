namespace EmployeeManagementSystem.Helpers
{
    public class EmailAlreadyExistsException : Exception
    {
        public EmailAlreadyExistsException() : base() { }

        public EmailAlreadyExistsException(string message) : base(message) { }

        public EmailAlreadyExistsException(string message, Exception innerException) : base(message, innerException) { }
    }

}
