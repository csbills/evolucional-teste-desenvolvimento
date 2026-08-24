using System.Data;

namespace Evolucional.Application.Abstractions
{
    public interface IConnectionFactory
    {
        IDbConnection Create();
    }
}
