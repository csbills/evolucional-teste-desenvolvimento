export function parseProductId(id?: string) {
  const parsedId = Number(id)

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
}
