const products = [
  {
    id: 1,
    name: "Wizytówka",
    price: 3,
    finishings: [{ id: 1, name: "Laminowanie", extra: 0.3 }],
  },
  {
    id: 2,
    name: "Ulotka",
    price: 5,
    finishings: [{ id: 1, name: "Laminowanie", extra: 0.3 }],
  },
  { id: 3, name: "Baner", price: 20, finishings: [] },
];

// Sprawdzenie czy coś jesyt zapisane w localStorage
const raw = localStorage.getItem("products");
if (raw) {
  try {
    const savedProducts = JSON.parse(raw);
    if (Array.isArray(savedProducts) && savedProducts.length > 0) {
      // zachowujemy referencję do istniejącej tablicy (jeśli używasz const products)
      products.length = 0;
      products.push(...savedProducts);
    } else {
      console.warn(
        'localStorage: "products" ma nieprawidłowy format — ignoruję.'
      );
      // opcjonalnie można usunąć zepsute dane:
      localStorage.removeItem("products");
    }
  } catch (err) {
    console.error('Nie udało się sparsować "products" z localStorage:', err);
    // opcjonalnie usuń uszkodzony klucz, żeby nie próbować parsować ponownie:
    localStorage.removeItem("products");
  }
}

function getProducts() {
  return products.map((product) => product.name);
}

function addProduct(name, price) {
  const normalized = String(name).trim();
  if (isProductDuplicate(products, normalized)) {
    alert("Produkt o takiej nazwie już istnieje!");
    return null;
  }

  const id = Date.now();
  const newProduct = {
    id,
    name: normalized,
    price: Number(price),
    finishings: [],
  };
  products.push(newProduct);
  saveProductsToStorage();
  return id;
}

function removeProduct(name) {
  const index = products.findIndex((product) => product.name === name);
  if (index !== -1) {
    products.splice(index, 1);
  }
  saveProductsToStorage();
}

function updateProductName(oldName, newName) {
  const product = products.find((product) => product.name === oldName);
  if (product) {
    product.name = newName;
  } else {
    console.log("Product not found");
  }
  saveProductsToStorage();
}

function updateProductPrice(name, newPrice) {
  const product = products.find((product) => product.name === name);
  if (product) {
    product.price = newPrice;
  } else {
    console.log("Product not found");
  }
  saveProductsToStorage();
}

function removeFinishing(productId, finishingId) {
  const product = products.find((p) => p.id === productId);
  if (!product || !Array.isArray(product.finishings)) return; // zabezpieczenie
  product.finishings = product.finishings.filter((f) => f.id !== finishingId);
  saveProductsToStorage();
}

function updateFinishing(productId, finishingId, newName, newPrice) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  const finishing = product.finishings.find((f) => f.id === finishingId);
  if (!finishing) return;
  finishing.name = newName;
  finishing.extra = newPrice;
  saveProductsToStorage();
}

// Metoda do zapisania produktów w localStorage
function saveProductsToStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}
