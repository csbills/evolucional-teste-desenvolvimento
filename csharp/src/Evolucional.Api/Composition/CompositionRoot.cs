using Evolucional.Application.Abstractions;
using Evolucional.Application.Alunos;
using Evolucional.Application.Turmas;
using Evolucional.Infrastructure.Data;
using Evolucional.Infrastructure.Repositories;

namespace Evolucional.Api.Composition
{
    public static class CompositionRoot
    {
        public static AlunoService CreateAlunoService()
        {
            IConnectionFactory connectionFactory = new SqlConnectionFactory();
            IAlunoRepository alunoRepository = new AlunoRepository(connectionFactory);

            return new AlunoService(alunoRepository);
        }

        public static TurmaService CreateTurmaService()
        {
            IConnectionFactory connectionFactory = new SqlConnectionFactory();
            ITurmaRepository turmaRepository = new TurmaRepository(connectionFactory);

            return new TurmaService(turmaRepository);
        }
    }
}
