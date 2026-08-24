namespace Evolucional.Application.Matriculas
{
    public sealed class CriarMatriculaCommand
    {
        public int AlunoId { get; set; }

        public int TurmaId { get; set; }
    }

    public sealed class MatriculaDto
    {
        public int Id { get; set; }

        public int AlunoId { get; set; }

        public int TurmaId { get; set; }
    }
}
