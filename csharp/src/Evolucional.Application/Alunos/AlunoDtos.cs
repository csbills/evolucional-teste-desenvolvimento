using System;

namespace Evolucional.Application.Alunos
{
    public sealed class AlunoDto
    {
        public int Id { get; set; }

        public string Nome { get; set; }

        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }

        public bool Ativo { get; set; }

        public DateTime DataCadastro { get; set; }
    }

    public sealed class CriarAlunoCommand
    {
        public string Nome { get; set; }

        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }
    }

    public sealed class AtualizarAlunoCommand
    {
        public string Nome { get; set; }

        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }
    }
}
