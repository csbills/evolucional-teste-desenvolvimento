using System.Data;
using Evolucional.Domain.Entities;

namespace Evolucional.Application.Abstractions
{
    public interface IMatriculaRepository
    {
        bool Existe(int alunoId, int turmaId);

        bool Existe(int alunoId, int turmaId, IDbConnection connection, IDbTransaction transaction);

        int Inserir(Matricula matricula);

        int Inserir(Matricula matricula, IDbConnection connection, IDbTransaction transaction);
    }
}
