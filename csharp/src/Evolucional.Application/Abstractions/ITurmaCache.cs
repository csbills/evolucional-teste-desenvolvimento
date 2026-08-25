using System.Collections.Generic;
using Evolucional.Application.Turmas;

namespace Evolucional.Application.Abstractions
{
    public interface ITurmaCache
    {
        bool TentarObter(out IReadOnlyList<TurmaDto> turmas);

        void Armazenar(IReadOnlyList<TurmaDto> turmas);

        void Invalidar();
    }
}
