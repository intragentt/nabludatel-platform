export function formatPrice(price) {
    if (!price) {
        return null;
    }
    const valueString = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return { value: valueString, currency: "RUB" };
}
