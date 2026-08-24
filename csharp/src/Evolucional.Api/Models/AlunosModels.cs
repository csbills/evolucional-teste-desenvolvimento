using System;
using System.ComponentModel.DataAnnotations;

namespace Evolucional.Api.Models
{
    public sealed class CriarAlunoRequest
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Nome { get; set; }

        [Required]
        [StringLength(120)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime? DataNascimento { get; set; }
    }

    public sealed class AtualizarAlunoRequest
    {
        [Required]
        [StringLength(120, MinimumLength = 2)]
        public string Nome { get; set; }

        [Required]
        [StringLength(120)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime? DataNascimento { get; set; }
    }

    public sealed class PagedResponse<T>
    {
        public PagedResponse(T[] items, int total, int page, int pageSize)
        {
            Items = items;
            Total = total;
            Page = page;
            PageSize = pageSize;
        }

        public T[] Items { get; private set; }

        public int Total { get; private set; }

        public int Page { get; private set; }

        public int PageSize { get; private set; }
    }
}
