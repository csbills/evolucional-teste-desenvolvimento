namespace Evolucional.Infrastructure.Sql
{
    internal static class AlunoSql
    {
        internal const string Listar = @"
SELECT
    Id,
    Nome,
    Email,
    DataNascimento,
    Ativo,
    DataCadastro
FROM dbo.Aluno
WHERE Ativo = 1
  AND (@Nome IS NULL OR Nome LIKE '%' + @Nome + '%')
ORDER BY Nome, Id
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;";

        internal const string Contar = @"
SELECT COUNT(1)
FROM dbo.Aluno
WHERE Ativo = 1
  AND (@Nome IS NULL OR Nome LIKE '%' + @Nome + '%');";

        internal const string ObterPorId = @"
SELECT
    Id,
    Nome,
    Email,
    DataNascimento,
    Ativo,
    DataCadastro
FROM dbo.Aluno
WHERE Id = @Id;";

        internal const string Inserir = @"
INSERT INTO dbo.Aluno (Nome, Email, DataNascimento, Ativo)
OUTPUT INSERTED.Id
VALUES (@Nome, @Email, @DataNascimento, @Ativo);";

        internal const string Atualizar = @"
UPDATE dbo.Aluno
SET Nome = @Nome,
    Email = @Email,
    DataNascimento = @DataNascimento
WHERE Id = @Id;";

        internal const string Desativar = @"
UPDATE dbo.Aluno
SET Ativo = 0
WHERE Id = @Id;";
    }
}
