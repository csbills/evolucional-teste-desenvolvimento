using System;
using System.Collections.Generic;

namespace Evolucional.Application.Common
{
    public sealed class PagedResult<T>
    {
        public PagedResult(IReadOnlyList<T> items, int total)
        {
            Items = items ?? throw new ArgumentNullException(nameof(items));
            Total = total;
        }

        public IReadOnlyList<T> Items { get; private set; }

        public int Total { get; private set; }
    }
}
