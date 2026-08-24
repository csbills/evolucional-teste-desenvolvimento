using System;
using System.Linq;
using System.Net;
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
            var result = _service.Listar(nome, page, pageSize);
            var response = new PagedResponse<AlunoDto>(
                result.Items.ToArray(),
                result.Total,
                page,
                pageSize);

            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}", Name = "AlunoPorId")]
        public IHttpActionResult ObterPorId(int id)
        {
            return Ok(_service.ObterPorId(id));
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Criar(CriarAlunoRequest request)
        {
            if (request == null)
            {
                return Content(
                    HttpStatusCode.BadRequest,
                    new ApiErrorResponse(
                        "REQUISICAO_INVALIDA",
                        "O corpo da requisição é obrigatório."));
            }

            if (!ModelState.IsValid)
            {
                return Content(
                    HttpStatusCode.BadRequest,
                    new ApiErrorResponse(
                        "REQUISICAO_INVALIDA",
                        "A requisição contém dados inválidos."));
            }

            var id = _service.Criar(new CriarAlunoCommand
            {
                Nome = request.Nome,
                Email = request.Email,
                DataNascimento = request.DataNascimento.Value
            });

            var aluno = _service.ObterPorId(id);
            return CreatedAtRoute("AlunoPorId", new { id }, aluno);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult Atualizar(int id, AtualizarAlunoRequest request)
        {
            if (request == null)
            {
                return Content(
                    HttpStatusCode.BadRequest,
                    new ApiErrorResponse(
                        "REQUISICAO_INVALIDA",
                        "O corpo da requisição é obrigatório."));
            }

            if (!ModelState.IsValid)
            {
                return Content(
                    HttpStatusCode.BadRequest,
                    new ApiErrorResponse(
                        "REQUISICAO_INVALIDA",
                        "A requisição contém dados inválidos."));
            }

            _service.Atualizar(id, new AtualizarAlunoCommand
            {
                Nome = request.Nome,
                Email = request.Email,
                DataNascimento = request.DataNascimento.Value
            });

            return Ok(_service.ObterPorId(id));
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Desativar(int id)
        {
            _service.Desativar(id);
            return Ok();
        }
    }
}
