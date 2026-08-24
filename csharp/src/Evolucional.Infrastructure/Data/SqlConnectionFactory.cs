using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Evolucional.Application.Abstractions;

namespace Evolucional.Infrastructure.Data
{
    public sealed class SqlConnectionFactory : IConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory()
            : this(GetConfiguredConnectionString())
        {
        }

        public SqlConnectionFactory(string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new ArgumentException("A connection string do banco não foi configurada.", nameof(connectionString));
            }

            _connectionString = connectionString;
        }

        public IDbConnection Create()
        {
            return new SqlConnection(_connectionString);
        }

        private static string GetConfiguredConnectionString()
        {
            var connection = ConfigurationManager.ConnectionStrings["TesteEscola"];

            if (connection == null)
            {
                throw new ConfigurationErrorsException(
                    "A connection string 'TesteEscola' não foi encontrada no Web.config.");
            }

            return connection.ConnectionString;
        }
    }
}
