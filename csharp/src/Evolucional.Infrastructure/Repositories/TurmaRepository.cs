using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using Evolucional.Application.Abstractions;
using Evolucional.Domain.Entities;
using Evolucional.Infrastructure.Data;
using Evolucional.Infrastructure.Sql;

namespace Evolucional.Infrastructure.Repositories
{
    public sealed class TurmaRepository : RepositoryBase, ITurmaRepository
    {
        public TurmaRepository(IConnectionFactory connectionFactory)
            : base(connectionFactory)
        {
        }

        public IReadOnlyList<Turma> Listar()
        {
            using (var connection = OpenConnection())
            {
                return connection.Query<Turma>(TurmaSql.Listar).ToList();
            }
        }

        public Turma ObterPorId(int id)
        {
            using (var connection = OpenConnection())
            {
                return connection.QuerySingleOrDefault<Turma>(
                    TurmaSql.ObterPorId,
                    new { Id = id });
            }
        }

        public Turma ObterPorIdParaAtualizacao(
            int id,
            IDbConnection connection,
            IDbTransaction transaction)
        {
            return connection.QuerySingleOrDefault<Turma>(
                TurmaSql.ObterPorIdParaAtualizacao,
                new { Id = id },
                transaction);
        }

        public int DecrementarVaga(
            int turmaId,
            IDbConnection connection,
            IDbTransaction transaction)
        {
            return connection.Execute(
                TurmaSql.DecrementarVaga,
                new { TurmaId = turmaId },
                transaction);
        }
    }
}
