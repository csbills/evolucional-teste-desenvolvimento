namespace Evolucional.Domain.Exceptions
{
    public sealed class TurmaSemVagaException : BusinessRuleException
    {
        public TurmaSemVagaException()
            : base(
                "TURMA_SEM_VAGA",
                "A turma não possui vagas disponíveis.")
        {
        }
    }
}
