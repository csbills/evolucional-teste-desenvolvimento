namespace Evolucional.Infrastructure.Sql
{
    internal static class RelatorioSql
    {
        internal const string AlunosPorTurma = @"
SELECT
    t.Id AS TurmaId,
    t.Nome AS NomeTurma,
    COUNT(m.Id) AS QuantidadeAlunosMatriculados,
    t.VagasDisponiveis AS VagasRestantes
FROM dbo.Turma AS t
LEFT JOIN dbo.Matricula AS m ON m.TurmaId = t.Id
GROUP BY
    t.Id,
    t.Nome,
    t.VagasDisponiveis
ORDER BY
    t.Nome,
    t.Id;";
    }
}
