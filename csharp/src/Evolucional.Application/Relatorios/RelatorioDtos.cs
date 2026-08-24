namespace Evolucional.Application.Relatorios
{
    public sealed class AlunoPorTurmaDto
    {
        public int TurmaId { get; set; }

        public string NomeTurma { get; set; }

        public int QuantidadeAlunosMatriculados { get; set; }

        public int VagasRestantes { get; set; }
    }
}
