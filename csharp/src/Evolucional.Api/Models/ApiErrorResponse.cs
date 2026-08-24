namespace Evolucional.Api.Models
{
    public sealed class ApiErrorResponse
    {
        public ApiErrorResponse(string code, string message)
        {
            Code = code;
            Message = message;
        }

        public string Code { get; private set; }

        public string Message { get; private set; }
    }
}
