const circulation = document.getElementById("quantity");
const submitButton = document.querySelector('#offerForm button[type="submit"]');
const productSelect = document.getElementById("product");
const priceOutput = document.getElementById("priceOutput");
const editButton = document.querySelector("#manageProductsBtn");
const modalDiv = document.querySelector("#productModal");
const ulList = document.querySelector("#productList");
const addProductForm = document.getElementById("addProductForm");
const discountInput = document.getElementById("discount");
const summaryModal = document.getElementById("summaryModal");
const closeSummary = document.getElementById("closeSummary");

// Funkcja do renderowania opcji wykończenia
function renderFinishingOptions(product) {
  finishingSelect.innerHTML = '<option value="">Brak</option>';
  if (!product || !product.finishings) {
    return; // jeśli produkt nie istnieje → po prostu wyczyść i wyjdź
  }
  if (product.finishings) {
    product.finishings.forEach((fin) => {
      const option = document.createElement("option");
      option.value = fin.id;
      option.textContent = `${fin.name} (+${fin.extra} zł/szt.)`;
      finishingSelect.appendChild(option);
    });
  }
}

function handleSubmit(e) {
  e.preventDefault();

  const selectedId = Number(productSelect.value);
  const quantity = Number(circulation.value);
  const finishingId = Number(finishingSelect.value);
  const discount = Number(discountInput.value) || 0;

  const validation = validateForm(selectedId, quantity);
  if (validation.message) {
    priceOutput.innerHTML = validation.message;
    return;
  }

  const product = products.find((p) => p.id === selectedId);
  let finishing = null;

  if (finishingId) {
    finishing = product.finishings?.find((f) => f.id === finishingId) || null;
  }

  // przekazujemy discount do kalkulacji
  const summary = calculateDetailedPrice(
    product,
    quantity,
    finishing,
    discount
  );

  renderSummaryModal(summary, product, finishing, quantity);
}

function updatePreview() {
  const selectedValue = productSelect.value;
  const quantity = Number(circulation.value);
  const finishingSelect = document.getElementById("finishing");
  const discount = Number(discountInput.value) || 0;

  if (discount < 0 || discount > 100) {
    priceOutput.innerHTML = "Rabat musi być między 0 a 100%.";
    discountInput.classList.add("error");
    return;
  }
  discountInput.classList.remove("error");

  // użyj tej samej walidacji co w handleSubmit
  const validation = validateForm(selectedValue, quantity);
  if (validation.message) {
    priceOutput.innerHTML = validation.message;
    productSelect.classList.remove("error");
    circulation.classList.remove("error");
    if (validation.errors.includes("product"))
      productSelect.classList.add("error");
    if (validation.errors.includes("quantity"))
      circulation.classList.add("error");
    return;
  }

  // walidacja OK — usuń klasy error
  productSelect.classList.remove("error");
  circulation.classList.remove("error");

  const selectedId = Number(productSelect.value);
  const product = products.find((p) => p.id === selectedId);
  if (!product) {
    priceOutput.innerHTML = "Nie znaleziono produktu.";
    return;
  }

  const finishingId = Number(finishingSelect.value);
  let finishingExtra = 0;

  if (finishingId && product.finishings) {
    const finishing = product.finishings.find((f) => f.id === finishingId);
    if (finishing) {
      finishingExtra = finishing.extra;
    }
  }

  const basePrice = calculatePrice(product.price + finishingExtra, quantity);
  const finalPrice = basePrice * (1 - discount / 100);

  priceOutput.innerHTML = `Cena: ${finalPrice.toFixed(2)} zł`;
}
discountInput.addEventListener("input", updatePreview);

renderProductSelect();

submitButton.addEventListener("click", handleSubmit);
circulation.addEventListener("input", updatePreview);
productSelect.addEventListener("change", () => {
  const selectedId = Number(productSelect.value);
  const product = products.find((p) => p.id === selectedId);
  renderFinishingOptions(product);
  updatePreview();
});

const finishingSelect = document.getElementById("finishing");
finishingSelect.addEventListener("change", updatePreview);

editButton.addEventListener("click", () => {
  modalDiv.style.display = "block";
  renderProductSelect();
  renderProductList(products);
});

document.querySelectorAll(".modal .close").forEach((span) => {
  span.addEventListener("click", () => {
    const modal = span.closest(".modal");
    if (modal) modal.style.display = "none";
  });
});

// zamykaj też edit modal po kliknięciu w tło
const editModalDiv = document.getElementById("editProductModal");
if (editModalDiv) {
  editModalDiv.addEventListener("click", (event) => {
    if (event.target === editModalDiv) editModalDiv.style.display = "none";
  });
}

addProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("newProductName").value.trim();
  const price = parseFloat(document.getElementById("newProductPrice").value);

  if (!name || isNaN(price) || price < 0) {
    alert("Podaj poprawną nazwę i cenę produktu.");
    return;
  }

  addProduct(name, price);
  renderProductSelect(); // odśwież select z produktami
  renderProductList(products);
  productSelect.value = ""; // ustaw placeholder jako zaznaczony
  renderFinishingOptions(null); // wyczyść opcje wykończeń
  updatePreview(); // odśwież podgląd (opcjonalnie)
  addProductForm.reset();
});

closeSummary.addEventListener("click", () => {
  summaryModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === summaryModal) summaryModal.style.display = "none";
});

// Generowanie PDF
document.getElementById("downloadPDF").addEventListener("click", generatePDF);
function generatePDF() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    console.error("jsPDF not found. Sprawdź, czy załadowano jspdf.umd.min.js");
    return;
  }

  const doc = new jsPDF();

  const clientInput = document.getElementById("clientName");
  const clientName = clientInput?.value.trim() || "Brak nazwy klienta";

  const selectedId = Number(productSelect.value);
  const product = products.find((p) => p.id === selectedId);
  const productName = product ? product.name : "Nie wybrano produktu";

  const quantity = Number(document.getElementById("quantity").value) || 0;
  const finishingId = Number(document.getElementById("finishing").value) || 0;
  const finishing =
    product && finishingId
      ? product.finishings.find((f) => f.id === finishingId) || null
      : null;
  const finishingName = finishing ? finishing.name : "Brak wykończenia";

  const discount = Number(discountInput.value) || 0;

  // obliczenie szczegółów (uwzględnia rabat)
  const summary = product
    ? calculateDetailedPrice(product, quantity, finishing, discount)
    : { basePrice: 0, finishingExtra: 0, total: 0, finalTotal: 0, discount };

  const totalPriceText = `${summary.finalTotal.toFixed(2)} zl`;

  // Nagłówek PDF
  doc.setFontSize(18);
  doc.text("Oferta cenowa", 14, 20);
  doc.setFontSize(12);
  doc.text(`Klient: ${clientName}`, 14, 30);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 37);

  // Obliczenia do tabeli
  const basePrintPrice = product.price * quantity;
  const finishingPrice = finishing ? finishing.extra * quantity : 0;

  // Rabat w złotówkach
  const discountPercent = Number(discountInput.value) || 0;
  const discountValue =
    (basePrintPrice + finishingPrice) * (discountPercent / 100);

  // Dane do tabeli
  const tableData = [
    ["Produkt", productName],
    ["Naklad", String(quantity)],
    ["Cena druku", `${basePrintPrice.toFixed(2)} zl`],
    ["Cena wykonczenia", `${finishingPrice.toFixed(2)} zl`],
    ["Rabat", `${discountPercent}% (-${discountValue.toFixed(2)} zl)`],
    ["Cena koncowa", `${summary.finalTotal.toFixed(2)} zl`],
  ];

  if (typeof doc.autoTable !== "function") {
    // W przypadku braku autoTable wypisz ręcznie
    let y = 50;
    tableData.forEach((row) => {
      doc.text(`${row[0]}: ${row[1]}`, 14, y);
      y += 8;
    });
  } else {
    doc.autoTable({
      startY: 50,
      head: [["Wybrany parametr", "Wartosc"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold" },
        1: { cellWidth: 110 },
      },
    });
  }

  // Stopka PDF
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text(
    "Dokument wygenerowany automatycznie przez system ofertowy",
    14,
    pageHeight - 10
  );

  doc.save(`Oferta_${clientName || "bez_nazwy"}.pdf`);
}
