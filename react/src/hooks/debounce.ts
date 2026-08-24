export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void
  cancel: () => void
}

export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): DebouncedFunction<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined
      callback(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced
}
