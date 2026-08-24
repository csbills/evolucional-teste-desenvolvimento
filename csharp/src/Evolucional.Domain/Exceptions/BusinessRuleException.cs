using System;

namespace Evolucional.Domain.Exceptions
{
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string code, string message)
            : base(message)
        {
            Code = code;
        }

        public string Code { get; private set; }
    }
}
