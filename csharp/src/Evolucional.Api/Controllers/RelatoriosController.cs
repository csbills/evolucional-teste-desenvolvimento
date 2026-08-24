using System;
using System.Web.Http;
using Evolucional.Api.Composition;
using Evolucional.Application.Relatorios;

namespace Evolucional.Api.Controllers
{
    [RoutePrefix("api/relatorios")]
    public sealed class RelatoriosController : ApiController
    {
        private readonly RelatorioService _service;

        public RelatoriosController()
            : this(CompositionRoot.CreateRelatorioService())
        {
        }

        internal RelatoriosController(RelatorioService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [HttpGet]
        [Route("alunos-por-turma")]
        public IHttpActionResult ObterAlunosPorTurma()
        {
            return Ok(_service.ObterAlunosPorTurma());
        }
    }
}
