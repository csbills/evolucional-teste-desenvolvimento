export function getProductsEmptyStateMessage(hasFilters: boolean) {
  return hasFilters
    ? 'Tente ajustar os filtros para encontrar outros produtos.'
    : 'Crie seu primeiro produto.'
}
