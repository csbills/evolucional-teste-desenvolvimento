using System;
using System.Net;
using System.Web.Http;
using Evolucional.Api.Composition;
using Evolucional.Api.Models;
using Evolucional.Application.Matriculas;

namespace Evolucional.Api.Controllers
{
    [RoutePrefix("api/matriculas")]
    public sealed class MatriculasController : ApiController
    {
        private readonly MatriculaService _service;

        public MatriculasController()
            : this(CompositionRoot.CreateMatriculaService())
        {
        }

        internal MatriculasController(MatriculaService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Criar(CriarMatriculaRequest request)
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

            var matricula = _service.Criar(new CriarMatriculaCommand
            {
                AlunoId = request.AlunoId.Value,
                TurmaId = request.TurmaId.Value
            });

            return Content(HttpStatusCode.Created, matricula);
        }
    }
}
