function calculatePrice(product, quantity) {
  return product * quantity;
}
function calculateDetailedPrice(product, quantity, finishing, discount = 0) {
  const basePrice = Number(product.price) * Number(quantity);
  const finishingExtra = finishing
    ? Number(finishing.extra) * Number(quantity)
    : 0;
  const total = basePrice + finishingExtra;
  const finalTotal = total * (1 - Number(discount) / 100);

  return {
    basePrice,
    finishingExtra,
    total,
    finalTotal,
    discount: Number(discount),
  };
}
