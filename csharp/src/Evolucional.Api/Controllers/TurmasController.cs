using System;
using System.Web.Http;
using Evolucional.Api.Composition;
using Evolucional.Application.Turmas;

namespace Evolucional.Api.Controllers
{
    [RoutePrefix("api/turmas")]
    public sealed class TurmasController : ApiController
    {
        private readonly TurmaService _service;

        public TurmasController()
            : this(CompositionRoot.CreateTurmaService())
        {
        }

        internal TurmasController(TurmaService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Listar()
        {
            return Ok(_service.Listar());
        }
    }
}
