using System.Collections.Generic;
using System.Linq;
using Dapper;
using Evolucional.Application.Abstractions;
using Evolucional.Application.Relatorios;
using Evolucional.Infrastructure.Data;
using Evolucional.Infrastructure.Sql;

namespace Evolucional.Infrastructure.Repositories
{
    public sealed class RelatorioRepository : RepositoryBase, IRelatorioRepository
    {
        public RelatorioRepository(IConnectionFactory connectionFactory)
            : base(connectionFactory)
        {
        }

        public IReadOnlyList<AlunoPorTurmaDto> ObterAlunosPorTurma()
        {
            using (var connection = OpenConnection())
            {
                return connection
                    .Query<AlunoPorTurmaDto>(RelatorioSql.AlunosPorTurma)
                    .ToList();
            }
        }
    }
}
