function validateForm(selectedValue, quantity) {
  const errors = [];
  let message = "";

  if (!selectedValue) {
    message += "Wybierz produkt.<br>";
    errors.push("product");
  }

  if (!quantity || quantity <= 0) {
    message += "Podaj poprawny nakład.<br>";
    errors.push("quantity");
  }

  return { message, errors };
}
// Funkcja do sprawdzania, czy produkt o danej nazwie już istnieje
function isProductDuplicate(products, name) {
  return products.some(
    (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
}
