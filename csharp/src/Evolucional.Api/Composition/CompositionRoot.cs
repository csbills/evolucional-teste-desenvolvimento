using Evolucional.Application.Abstractions;
using Evolucional.Application.Alunos;
using Evolucional.Application.Matriculas;
using Evolucional.Application.Relatorios;
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

        public static MatriculaService CreateMatriculaService()
        {
            IConnectionFactory connectionFactory = new SqlConnectionFactory();
            IAlunoRepository alunoRepository = new AlunoRepository(connectionFactory);
            ITurmaRepository turmaRepository = new TurmaRepository(connectionFactory);
            IMatriculaRepository matriculaRepository = new MatriculaRepository(connectionFactory);

            return new MatriculaService(
                connectionFactory,
                alunoRepository,
                turmaRepository,
                matriculaRepository);
        }

        public static RelatorioService CreateRelatorioService()
        {
            IConnectionFactory connectionFactory = new SqlConnectionFactory();
            IRelatorioRepository relatorioRepository = new RelatorioRepository(connectionFactory);

            return new RelatorioService(relatorioRepository);
        }
    }
}
