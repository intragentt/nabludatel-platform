export interface PriceParts {
  value: string;
  currency: string;
}

export function formatPrice(
  price: number | null | undefined
): PriceParts | null {
  if (!price) {
    return null;
  }
  const valueString = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return { value: valueString, currency: "RUB" };
}
