using System;
using System.Collections.Generic;
using Evolucional.Application.Abstractions;

namespace Evolucional.Application.Relatorios
{
    public sealed class RelatorioService
    {
        private readonly IRelatorioRepository _repository;

        public RelatorioService(IRelatorioRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public IReadOnlyList<AlunoPorTurmaDto> ObterAlunosPorTurma()
        {
            return _repository.ObterAlunosPorTurma();
        }
    }
}
