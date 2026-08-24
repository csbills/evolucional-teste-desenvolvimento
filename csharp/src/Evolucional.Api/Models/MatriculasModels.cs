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
}
