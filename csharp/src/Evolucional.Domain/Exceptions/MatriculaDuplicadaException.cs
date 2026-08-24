namespace Evolucional.Domain.Exceptions
{
    public sealed class MatriculaDuplicadaException : BusinessRuleException
    {
        public MatriculaDuplicadaException()
            : base(
                "MATRICULA_DUPLICADA",
                "O aluno já está matriculado nesta turma.")
        {
        }
    }
}
