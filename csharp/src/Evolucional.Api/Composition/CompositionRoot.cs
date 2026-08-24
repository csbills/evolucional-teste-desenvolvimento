using Evolucional.Application.Abstractions;
using Evolucional.Application.Alunos;
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
    }
}
