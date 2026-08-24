using System;
using System.Linq;
using System.Web.Http;
using Evolucional.Api.Composition;
using Evolucional.Api.Models;
using Evolucional.Application.Alunos;

namespace Evolucional.Api.Controllers
{
    [RoutePrefix("api/alunos")]
    public sealed class AlunosController : ApiController
    {
        private readonly AlunoService _service;

        public AlunosController()
            : this(CompositionRoot.CreateAlunoService())
        {
        }

        internal AlunosController(AlunoService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Listar(string nome = null, int page = 1, int pageSize = 10)
        {
            try
            {
                var result = _service.Listar(nome, page, pageSize);
                var response = new PagedResponse<AlunoDto>(
                    result.Items.ToArray(),
                    result.Total,
                    page,
                    pageSize);

                return Ok(response);
            }
            catch (ArgumentOutOfRangeException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet]
        [Route("{id:int}", Name = "AlunoPorId")]
        public IHttpActionResult ObterPorId(int id)
        {
            try
            {
                var aluno = _service.ObterPorId(id);
                return aluno == null ? (IHttpActionResult)NotFound() : Ok(aluno);
            }
            catch (ArgumentOutOfRangeException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Criar(CriarAlunoRequest request)
        {
            if (request == null)
            {
                return BadRequest("O corpo da requisição é obrigatório.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var id = _service.Criar(new CriarAlunoCommand
                {
                    Nome = request.Nome,
                    Email = request.Email,
                    DataNascimento = request.DataNascimento.Value
                });

                var aluno = _service.ObterPorId(id);
                return CreatedAtRoute("AlunoPorId", new { id }, aluno);
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult Atualizar(int id, AtualizarAlunoRequest request)
        {
            if (request == null)
            {
                return BadRequest("O corpo da requisição é obrigatório.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var atualizado = _service.Atualizar(id, new AtualizarAlunoCommand
                {
                    Nome = request.Nome,
                    Email = request.Email,
                    DataNascimento = request.DataNascimento.Value
                });

                if (!atualizado)
                {
                    return NotFound();
                }

                return Ok(_service.ObterPorId(id));
            }
            catch (ArgumentException exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Desativar(int id)
        {
            try
            {
                if (!_service.Desativar(id))
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (ArgumentOutOfRangeException exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
