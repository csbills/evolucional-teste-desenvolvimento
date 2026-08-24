using System.Web.Http;
using Evolucional.Api.Filters;
using Newtonsoft.Json.Serialization;

namespace Evolucional.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Filters.Add(new ApiExceptionFilterAttribute());
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver();
        }
    }
}
