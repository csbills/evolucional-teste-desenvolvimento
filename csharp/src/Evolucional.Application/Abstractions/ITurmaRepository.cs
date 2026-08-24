using System.Collections.Generic;
using System.Data;
using Evolucional.Domain.Entities;

namespace Evolucional.Application.Abstractions
{
    public interface ITurmaRepository
    {
        IReadOnlyList<Turma> Listar();

        Turma ObterPorId(int id);

        Turma ObterPorIdParaAtualizacao(int id, IDbConnection connection, IDbTransaction transaction);

        int DecrementarVaga(int turmaId, IDbConnection connection, IDbTransaction transaction);
    }
}
