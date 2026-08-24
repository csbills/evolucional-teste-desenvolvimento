using System;

namespace Evolucional.Domain.Exceptions
{
    public sealed class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string code, string message)
            : base(message)
        {
            Code = code;
        }

        public string Code { get; private set; }
    }
}
