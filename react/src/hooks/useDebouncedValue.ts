import { useEffect, useState } from 'react'

import { debounce } from './debounce'

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const updateValue = debounce(
      (nextValue: T) => setDebouncedValue(nextValue),
      delay,
    )

    updateValue(value)

    return updateValue.cancel
  }, [delay, value])

  return debouncedValue
}
