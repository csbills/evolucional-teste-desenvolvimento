using System;
using System.Collections.Generic;
using Evolucional.Application.Abstractions;
using Evolucional.Application.Turmas;

namespace Evolucional.Infrastructure.Caching
{
    public sealed class MemoryTurmaCache : ITurmaCache
    {
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

        private readonly object _syncRoot = new object();
        private IReadOnlyList<TurmaDto> _turmas;
        private DateTimeOffset _expiresAt;

        public bool TentarObter(out IReadOnlyList<TurmaDto> turmas)
        {
            lock (_syncRoot)
            {
                if (_turmas == null || _expiresAt <= DateTimeOffset.UtcNow)
                {
                    turmas = null;
                    return false;
                }

                turmas = Clonar(_turmas);
                return true;
            }
        }

        public void Armazenar(IReadOnlyList<TurmaDto> turmas)
        {
            if (turmas == null)
            {
                throw new ArgumentNullException(nameof(turmas));
            }
            
            lock (_syncRoot)
            {
                _turmas = Clonar(turmas);
                _expiresAt = DateTimeOffset.UtcNow.Add(CacheDuration);
            }
        }

        public void Invalidar()
        {
            lock (_syncRoot)
            {
                _turmas = null;
                _expiresAt = default(DateTimeOffset);
            }
        }

        private static IReadOnlyList<TurmaDto> Clonar(IEnumerable<TurmaDto> turmas)
        {
            var copia = new List<TurmaDto>();

            foreach (var turma in turmas)
            {
                copia.Add(new TurmaDto
                {
                    Id = turma.Id,
                    Nome = turma.Nome,
                    Periodo = turma.Periodo,
                    VagasTotal = turma.VagasTotal,
                    VagasDisponiveis = turma.VagasDisponiveis
                });
            }

            return copia;
        }
    }
}
