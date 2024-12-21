export function formatPrice(price: number) {
    const priceFormated = new Intl.NumberFormat('es-CO', {
        style: "currency",
        currency: "COP"
    })

    const finalPrice = priceFormated.format(price)

    return finalPrice
}