using System;

namespace Evolucional.Domain.Entities
{
    public sealed class Matricula
    {
        public int Id { get; set; }

        public int AlunoId { get; set; }

        public int TurmaId { get; set; }

        public DateTime DataMatricula { get; set; }
    }
}
