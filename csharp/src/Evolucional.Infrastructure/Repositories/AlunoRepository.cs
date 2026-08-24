using System;
using System.Data;
using System.Linq;
using Dapper;
using Evolucional.Application.Abstractions;
using Evolucional.Application.Common;
using Evolucional.Domain.Entities;
using Evolucional.Infrastructure.Data;
using Evolucional.Infrastructure.Sql;

namespace Evolucional.Infrastructure.Repositories
{
    public sealed class AlunoRepository : RepositoryBase, IAlunoRepository
    {
        public AlunoRepository(IConnectionFactory connectionFactory)
            : base(connectionFactory)
        {
        }

        public PagedResult<Aluno> Listar(string nome, int offset, int pageSize)
        {
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(offset));
            }

            if (pageSize <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(pageSize));
            }

            using (var connection = OpenConnection())
            {
                var parameters = new
                {
                    Nome = string.IsNullOrWhiteSpace(nome) ? null : nome.Trim(),
                    Offset = offset,
                    PageSize = pageSize
                };

                var items = connection.Query<Aluno>(AlunoSql.Listar, parameters).ToList();
                var total = connection.ExecuteScalar<int>(AlunoSql.Contar, parameters);

                return new PagedResult<Aluno>(items, total);
            }
        }

        public Aluno ObterPorId(int id)
        {
            using (var connection = OpenConnection())
            {
                return ObterPorId(id, connection, null);
            }
        }

        public Aluno ObterPorId(int id, IDbConnection connection, IDbTransaction transaction)
        {
            return connection.QuerySingleOrDefault<Aluno>(
                AlunoSql.ObterPorId,
                new { Id = id },
                transaction);
        }

        public int Inserir(Aluno aluno)
        {
            if (aluno == null)
            {
                throw new ArgumentNullException(nameof(aluno));
            }

            using (var connection = OpenConnection())
            {
                return connection.QuerySingle<int>(AlunoSql.Inserir, new
                {
                    aluno.Nome,
                    aluno.Email,
                    aluno.DataNascimento,
                    aluno.Ativo
                });
            }
        }

        public int Atualizar(Aluno aluno)
        {
            if (aluno == null)
            {
                throw new ArgumentNullException(nameof(aluno));
            }

            using (var connection = OpenConnection())
            {
                return connection.Execute(AlunoSql.Atualizar, new
                {
                    aluno.Id,
                    aluno.Nome,
                    aluno.Email,
                    aluno.DataNascimento
                });
            }
        }

        public int Desativar(int id)
        {
            using (var connection = OpenConnection())
            {
                return connection.Execute(AlunoSql.Desativar, new { Id = id });
            }
        }
    }
}
