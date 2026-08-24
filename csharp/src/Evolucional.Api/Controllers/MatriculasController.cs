using System;
using System.Net;
using System.Web.Http;
using Evolucional.Api.Composition;
using Evolucional.Api.Models;
using Evolucional.Application.Matriculas;
using Evolucional.Domain.Exceptions;

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
                return BadRequest("O corpo da requisição é obrigatório.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var matricula = _service.Criar(new CriarMatriculaCommand
                {
                    AlunoId = request.AlunoId.Value,
                    TurmaId = request.TurmaId.Value
                });

                return Content(HttpStatusCode.Created, matricula);
            }
            catch (ResourceNotFoundException exception)
            {
                return Content(
                    HttpStatusCode.NotFound,
                    new ApiErrorResponse(exception.Code, exception.Message));
            }
            catch (BusinessRuleException exception)
            {
                return Content(
                    HttpStatusCode.Conflict,
                    new ApiErrorResponse(exception.Code, exception.Message));
            }
            catch (ArgumentOutOfRangeException exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
