using System.ComponentModel.DataAnnotations;

namespace Evolucional.Api.Models
{
    public sealed class CriarMatriculaRequest
    {
        [Required]
        public int? AlunoId { get; set; }

        [Required]
        public int? TurmaId { get; set; }
    }

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
