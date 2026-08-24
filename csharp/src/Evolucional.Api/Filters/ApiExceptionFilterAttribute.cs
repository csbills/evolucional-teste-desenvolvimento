using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using Evolucional.Api.Models;
using Evolucional.Domain.Exceptions;

namespace Evolucional.Api.Filters
{
    public sealed class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var exception = actionExecutedContext.Exception;

            if (exception is ResourceNotFoundException)
            {
                var notFound = (ResourceNotFoundException)exception;
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.NotFound,
                    new ApiErrorResponse(notFound.Code, notFound.Message));
                return;
            }

            if (exception is BusinessRuleException)
            {
                var businessRule = (BusinessRuleException)exception;
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.Conflict,
                    new ApiErrorResponse(businessRule.Code, businessRule.Message));
                return;
            }

            if (exception is ArgumentException)
            {
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    new ApiErrorResponse("REQUISICAO_INVALIDA", exception.Message));
                return;
            }

            Trace.TraceError("Erro inesperado na API: {0}", exception);
            actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                HttpStatusCode.InternalServerError,
                new ApiErrorResponse(
                    "ERRO_INTERNO",
                    "Ocorreu um erro inesperado. Tente novamente mais tarde."));
        }
    }
}
