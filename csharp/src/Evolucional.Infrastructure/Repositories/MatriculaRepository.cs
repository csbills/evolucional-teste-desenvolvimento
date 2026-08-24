using System;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Evolucional.Application.Abstractions;
using Evolucional.Domain.Entities;
using Evolucional.Domain.Exceptions;
using Evolucional.Infrastructure.Data;
using Evolucional.Infrastructure.Sql;

namespace Evolucional.Infrastructure.Repositories
{
    public sealed class MatriculaRepository : RepositoryBase, IMatriculaRepository
    {
        public MatriculaRepository(IConnectionFactory connectionFactory)
            : base(connectionFactory)
        {
        }

        public bool Existe(int alunoId, int turmaId)
        {
            using (var connection = OpenConnection())
            {
                return Existe(alunoId, turmaId, connection, null);
            }
        }

        public bool Existe(int alunoId, int turmaId, IDbConnection connection, IDbTransaction transaction)
        {
            return connection.ExecuteScalar<bool>(
                MatriculaSql.Existe,
                new { AlunoId = alunoId, TurmaId = turmaId },
                transaction);
        }

        public int Inserir(Matricula matricula)
        {
            if (matricula == null)
            {
                throw new ArgumentNullException(nameof(matricula));
            }

            using (var connection = OpenConnection())
            {
                return Inserir(matricula, connection, null);
            }
        }

        public int Inserir(Matricula matricula, IDbConnection connection, IDbTransaction transaction)
        {
            if (matricula == null)
            {
                throw new ArgumentNullException(nameof(matricula));
            }

            try
            {
                return connection.QuerySingle<int>(
                    MatriculaSql.Inserir,
                    new { matricula.AlunoId, matricula.TurmaId },
                    transaction);
            }
            catch (SqlException exception) when (exception.Number == 2601 || exception.Number == 2627)
            {
                throw new MatriculaDuplicadaException();
            }
        }
    }
}
