namespace Evolucional.Infrastructure.Sql
{
    internal static class TurmaSql
    {
        internal const string Listar = @"
SELECT
    Id,
    Nome,
    Periodo,
    VagasTotal,
    VagasDisponiveis
FROM dbo.Turma
ORDER BY Nome, Id;";

        internal const string ObterPorId = @"
SELECT
    Id,
    Nome,
    Periodo,
    VagasTotal,
    VagasDisponiveis
FROM dbo.Turma
WHERE Id = @Id;";

        internal const string ObterPorIdParaAtualizacao = @"
SELECT
    Id,
    Nome,
    Periodo,
    VagasTotal,
    VagasDisponiveis
FROM dbo.Turma WITH (UPDLOCK, HOLDLOCK)
WHERE Id = @Id;";

        internal const string DecrementarVaga = @"
UPDATE dbo.Turma
SET VagasDisponiveis = VagasDisponiveis - 1
WHERE Id = @TurmaId
  AND VagasDisponiveis > 0;";
    }
}
