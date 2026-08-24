namespace Evolucional.Infrastructure.Sql
{
    internal static class MatriculaSql
    {
        internal const string Existe = @"
SELECT CASE WHEN EXISTS (
    SELECT 1
    FROM dbo.Matricula
    WHERE AlunoId = @AlunoId
      AND TurmaId = @TurmaId
) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END;";

        internal const string Inserir = @"
INSERT INTO dbo.Matricula (AlunoId, TurmaId)
OUTPUT INSERTED.Id
VALUES (@AlunoId, @TurmaId);";
    }
}
