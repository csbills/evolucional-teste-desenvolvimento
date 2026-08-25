using System;
using System.Collections.Generic;
using System.Linq;
using Evolucional.Application.Abstractions;
using Evolucional.Domain.Entities;

namespace Evolucional.Application.Turmas
{
    public sealed class TurmaService
    {
        private readonly ITurmaRepository _repository;
        private readonly ITurmaCache _cache;

        public TurmaService(ITurmaRepository repository, ITurmaCache cache)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public IReadOnlyList<TurmaDto> Listar()
        {
            IReadOnlyList<TurmaDto> turmasEmCache;
            if (_cache.TentarObter(out turmasEmCache))
            {
                return turmasEmCache;
            }

            var turmas = _repository.Listar()
                .Select(Mapear)
                .ToList();

            _cache.Armazenar(turmas);

            return turmas;
        }

        private static TurmaDto Mapear(Turma turma)
        {
            return new TurmaDto
            {
                Id = turma.Id,
                Nome = turma.Nome,
                Periodo = turma.Periodo,
                VagasTotal = turma.VagasTotal,
                VagasDisponiveis = turma.VagasDisponiveis
            };
        }
    }
}
