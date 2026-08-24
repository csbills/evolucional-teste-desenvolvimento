namespace Evolucional.Domain.Exceptions
{
    public sealed class AlunoInativoException : BusinessRuleException
    {
        public AlunoInativoException()
            : base(
                "ALUNO_INATIVO",
                "O aluno está inativo e não pode ser matriculado.")
        {
        }
    }
}
