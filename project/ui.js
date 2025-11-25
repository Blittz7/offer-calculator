const editModal = document.getElementById("editProductModal");
const editForm = document.getElementById("editProductForm");
const editNameInput = document.getElementById("editProductName");
const editPriceInput = document.getElementById("editProductPrice");
let editProductName = null;
let editProductId = null;

function renderProductSelect() {
  productSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "-- Wybierz produkt --";
  productSelect.appendChild(placeholderOption);

  // Dodaj opcje produktów z tablicy products
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
  });
}

function handleEditSubmit(event) {
  event.preventDefault();
  const newName = editNameInput.value.trim();
  const newPrice = parseFloat(editPriceInput.value);
  if (!newName || isNaN(newPrice) || newPrice < 0) {
    alert("Proszę podać poprawne dane produktu.");
    return;
  }
  updateProductName(editProductName, newName);
  updateProductPrice(newName, newPrice);
  editModal.style.display = "none";
  renderProductList(products);
  renderProductSelect(products);
}

function renderProductList(products) {
  ulList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ${product.price.toFixed(2)} zł`;
    ulList.appendChild(li);
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    editBtn.textContent = "Edytuj";
    deleteBtn.textContent = "Usuń";
    editBtn.classList.add("edit-btn");
    deleteBtn.classList.add("delete-btn");
    li.append(editBtn, deleteBtn);

    deleteBtn.addEventListener("click", () => {
      if (confirm(`Czy na pewno chcesz usunąć produkt "${product.name}"?`)) {
        removeProduct(product.name);
        renderProductSelect(getProducts());
        renderProductList(products);
      }
    });
    editBtn.addEventListener("click", () => {
      editProductId = product.id;
      editProductName = product.name;
      editNameInput.value = product.name;
      editPriceInput.value = product.price;
      editModal.style.display = "block";
      renderFinishingsList(product);

      editForm.onsubmit = handleEditSubmit;
    });
  });
}
function renderFinishingsList(product) {
  const list = document.getElementById("finishingsList");
  list.innerHTML = "";

  if (!product || !product.finishings || product.finishings.length === 0) {
    list.innerHTML = "<li>Brak wykończeń</li>";
    return;
  }

  product.finishings.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = `${f.name} – ${f.extra.toFixed(2)} zł/szt.`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edytuj";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Usuń";
    deleteBtn.classList.add("delete-btn");

    li.append(editBtn, deleteBtn);
    list.appendChild(li);

    deleteBtn.addEventListener("click", () => {
      if (confirm(`Usunąć wykończenie "${f.name}"?`)) {
        removeFinishing(product.id, f.id);
        renderFinishingsList(product);
      }
    });

    editBtn.addEventListener("click", () => {
      const newName = prompt("Nowa nazwa:", f.name);
      const newPrice = parseFloat(prompt("Nowa cena (zł/szt.):", f.extra));
      if (!newName || isNaN(newPrice)) return;
      updateFinishing(product.id, f.id, newName, newPrice);
      renderFinishingsList(product);
    });
  });
}
document.getElementById("addFinishingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("newFinishingName").value.trim();
  const price = parseFloat(document.getElementById("newFinishingPrice").value);
  if (!name || isNaN(price)) return alert("Podaj poprawne dane wykończenia.");

  // znajdź aktualnie edytowany produkt po id
  const product = products.find((p) => p.id === editProductId);
  if (!product) return;

  const newFinishing = {
    id: Date.now(),
    name,
    extra: price,
  };

  product.finishings.push(newFinishing);

  saveProductsToStorage(); // <-- zapisz zmiany do localStorage

  renderFinishingsList(product);
  e.target.reset();
});

// Funkcja do renderowania podsumowania w modalu
function renderSummaryModal(summary, product, finishing, quantity) {
  const modal = document.getElementById("summaryModal");
  const summaryBox = document.getElementById("summaryDetails");

  summaryBox.innerHTML = `
    <p><strong>Produkt:</strong> ${product.name}</p>
    <p><strong>Nakład:</strong> ${quantity} szt.</p>
    <p>Cena podstawowa: ${summary.basePrice.toFixed(2)} zł</p>
    <p>Wykończenie: ${
      finishing ? finishing.name : "Brak"
    } (${summary.finishingExtra.toFixed(2)} zł)</p>
    <p>Razem przed rabatem: ${summary.total.toFixed(2)} zł</p>
    <p>Rabat: ${summary.discount}%</p>
    <hr>
    <p><strong>Łącznie po rabacie:</strong> ${summary.finalTotal.toFixed(
      2
    )} zł</p>
  `;

  modal.style.display = "block";
}
