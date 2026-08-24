using System;
using System.Linq;
using Evolucional.Application.Abstractions;
using Evolucional.Application.Common;
using Evolucional.Domain.Entities;
using Evolucional.Domain.Exceptions;

namespace Evolucional.Application.Alunos
{
    public sealed class AlunoService
    {
        private const int PageSizeMaximo = 100;
        private readonly IAlunoRepository _repository;

        public AlunoService(IAlunoRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public PagedResult<AlunoDto> Listar(string nome, int page, int pageSize)
        {
            ValidarPaginacao(page, pageSize);

            var offset = checked((page - 1) * pageSize);
            var result = _repository.Listar(nome, offset, pageSize);
            var items = result.Items.Select(Mapear).ToList();

            return new PagedResult<AlunoDto>(items, result.Total);
        }

        public AlunoDto ObterPorId(int id)
        {
            ValidarId(id);

            var aluno = _repository.ObterPorId(id);

            if (aluno == null)
            {
                throw new ResourceNotFoundException(
                    "ALUNO_NAO_ENCONTRADO",
                    "O aluno informado não foi encontrado.");
            }

            return Mapear(aluno);
        }

        public int Criar(CriarAlunoCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var aluno = new Aluno
            {
                Nome = NormalizarTexto(command.Nome, nameof(command.Nome)),
                Email = NormalizarTexto(command.Email, nameof(command.Email)),
                DataNascimento = command.DataNascimento,
                Ativo = true
            };

            return _repository.Inserir(aluno);
        }

        public bool Atualizar(int id, AtualizarAlunoCommand command)
        {
            ValidarId(id);

            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var aluno = _repository.ObterPorId(id);

            if (aluno == null)
            {
                throw new ResourceNotFoundException(
                    "ALUNO_NAO_ENCONTRADO",
                    "O aluno informado não foi encontrado.");
            }

            aluno.Nome = NormalizarTexto(command.Nome, nameof(command.Nome));
            aluno.Email = NormalizarTexto(command.Email, nameof(command.Email));
            aluno.DataNascimento = command.DataNascimento;

            _repository.Atualizar(aluno);
            return true;
        }

        public void Desativar(int id)
        {
            ValidarId(id);

            if (_repository.Desativar(id) == 0)
            {
                throw new ResourceNotFoundException(
                    "ALUNO_NAO_ENCONTRADO",
                    "O aluno informado não foi encontrado.");
            }
        }

        private static void ValidarId(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "O ID deve ser maior que zero.");
            }
        }

        private static void ValidarPaginacao(int page, int pageSize)
        {
            if (page <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(page), "A página deve ser maior que zero.");
            }

            if (pageSize <= 0 || pageSize > PageSizeMaximo)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(pageSize),
                    "O tamanho da página deve estar entre 1 e 100.");
            }
        }

        private static string NormalizarTexto(string value, string parameterName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("O campo deve ser informado.", parameterName);
            }

            return value.Trim();
        }

        private static AlunoDto Mapear(Aluno aluno)
        {
            return new AlunoDto
            {
                Id = aluno.Id,
                Nome = aluno.Nome,
                Email = aluno.Email,
                DataNascimento = aluno.DataNascimento,
                Ativo = aluno.Ativo,
                DataCadastro = aluno.DataCadastro
            };
        }
    }
}
