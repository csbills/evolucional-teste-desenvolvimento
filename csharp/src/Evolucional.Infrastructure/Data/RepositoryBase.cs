using System;
using System.Data;
using Evolucional.Application.Abstractions;

namespace Evolucional.Infrastructure.Data
{
    public abstract class RepositoryBase
    {
        private readonly IConnectionFactory _connectionFactory;

        protected RepositoryBase(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
        }

        protected IDbConnection OpenConnection()
        {
            var connection = _connectionFactory.Create();

            try
            {
                connection.Open();
                return connection;
            }
            catch
            {
                connection.Dispose();
                throw;
            }
        }
    }
}
