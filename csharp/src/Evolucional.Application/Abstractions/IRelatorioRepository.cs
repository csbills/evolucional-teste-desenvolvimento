using System.Collections.Generic;
using Evolucional.Application.Relatorios;

namespace Evolucional.Application.Abstractions
{
    public interface IRelatorioRepository
    {
        IReadOnlyList<AlunoPorTurmaDto> ObterAlunosPorTurma();
    }
}
