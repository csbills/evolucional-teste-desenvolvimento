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

        public TurmaService(ITurmaRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public IReadOnlyList<TurmaDto> Listar()
        {
            return _repository.Listar()
                .Select(Mapear)
                .ToList();
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
