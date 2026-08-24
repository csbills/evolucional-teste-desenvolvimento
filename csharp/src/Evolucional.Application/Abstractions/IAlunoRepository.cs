using System.Data;
using Evolucional.Application.Common;
using Evolucional.Domain.Entities;

namespace Evolucional.Application.Abstractions
{
    public interface IAlunoRepository
    {
        PagedResult<Aluno> Listar(string nome, int offset, int pageSize);

        Aluno ObterPorId(int id);

        Aluno ObterPorId(int id, IDbConnection connection, IDbTransaction transaction);

        int Inserir(Aluno aluno);

        int Atualizar(Aluno aluno);

        int Desativar(int id);
    }
}
