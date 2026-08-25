using System;
using System.Data;
using Evolucional.Application.Abstractions;
using Evolucional.Domain.Entities;
using Evolucional.Domain.Exceptions;

namespace Evolucional.Application.Matriculas
{
    public sealed class MatriculaService
    {
        private readonly IConnectionFactory _connectionFactory;
        private readonly IAlunoRepository _alunoRepository;
        private readonly ITurmaRepository _turmaRepository;
        private readonly IMatriculaRepository _matriculaRepository;
        private readonly ITurmaCache _turmaCache;

        public MatriculaService(
            IConnectionFactory connectionFactory,
            IAlunoRepository alunoRepository,
            ITurmaRepository turmaRepository,
            IMatriculaRepository matriculaRepository,
            ITurmaCache turmaCache)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
            _alunoRepository = alunoRepository ?? throw new ArgumentNullException(nameof(alunoRepository));
            _turmaRepository = turmaRepository ?? throw new ArgumentNullException(nameof(turmaRepository));
            _matriculaRepository = matriculaRepository ?? throw new ArgumentNullException(nameof(matriculaRepository));
            _turmaCache = turmaCache ?? throw new ArgumentNullException(nameof(turmaCache));
        }

        public MatriculaDto Criar(CriarMatriculaCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            ValidarId(command.AlunoId, nameof(command.AlunoId));
            ValidarId(command.TurmaId, nameof(command.TurmaId));

            using (var connection = _connectionFactory.Create())
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction(IsolationLevel.Serializable))
                {
                    try
                    {
                        var aluno = _alunoRepository.ObterPorId(
                            command.AlunoId,
                            connection,
                            transaction);

                        if (aluno == null)
                        {
                            throw new ResourceNotFoundException(
                                "ALUNO_NAO_ENCONTRADO",
                                "O aluno informado não foi encontrado.");
                        }

                        if (!aluno.Ativo)
                        {
                            throw new AlunoInativoException();
                        }

                        var turma = _turmaRepository.ObterPorIdParaAtualizacao(
                            command.TurmaId,
                            connection,
                            transaction);

                        if (turma == null)
                        {
                            throw new ResourceNotFoundException(
                                "TURMA_NAO_ENCONTRADA",
                                "A turma informada não foi encontrada.");
                        }

                        if (turma.VagasDisponiveis <= 0)
                        {
                            throw new TurmaSemVagaException();
                        }

                        if (_matriculaRepository.Existe(
                                command.AlunoId,
                                command.TurmaId,
                                connection,
                                transaction))
                        {
                            throw new MatriculaDuplicadaException();
                        }

                        var matriculaId = _matriculaRepository.Inserir(
                            new Matricula
                            {
                                AlunoId = command.AlunoId,
                                TurmaId = command.TurmaId
                            },
                            connection,
                            transaction);

                        var vagasAtualizadas = _turmaRepository.DecrementarVaga(
                            command.TurmaId,
                            connection,
                            transaction);

                        if (vagasAtualizadas != 1)
                        {
                            throw new TurmaSemVagaException();
                        }

                        transaction.Commit();
                        _turmaCache.Invalidar();

                        return new MatriculaDto
                        {
                            Id = matriculaId,
                            AlunoId = command.AlunoId,
                            TurmaId = command.TurmaId
                        };
                    }
                    catch
                    {
                        TentarRollback(transaction);
                        throw;
                    }
                }
            }
        }

        private static void ValidarId(int id, string parameterName)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(
                    parameterName,
                    "O ID deve ser maior que zero.");
            }
        }

        private static void TentarRollback(IDbTransaction transaction)
        {
            try
            {
                transaction.Rollback();
            }
            catch
            {
                // Preserva a exceção original caso o rollback também falhe.
            }
        }
    }
}
