import { getStock, addSale } from "./api.js";

const saleForm = document.getElementById("saleForm");
const saleItemsDiv = document.getElementById("saleItemsDiv");
const paymentTypeSelect = document.getElementById("paymentType");
const borrowerNameInput = document.getElementById("borrowerName");

let stockData = [];

// Load stock for selection
async function loadStock() {
  stockData = await getStock();
  renderStockSelection();
}

function renderStockSelection() {
  saleItemsDiv.innerHTML = "";
  stockData.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("flex-row");
    div.innerHTML = `
      <span>${item.name} (${item.price}, Exp: ${item.expiry})</span>
      <input type="number" min="0" value="0" data-stockid="${item.id}" />
    `;
    saleItemsDiv.appendChild(div);
  });
}

saleForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const items = [];
  saleItemsDiv.querySelectorAll("input").forEach(input => {
    const qty = parseInt(input.value);
    if (qty > 0) {
      items.push({
        stockId: parseInt(input.dataset.stockid),
        qty,
        price: stockData.find(s => s.id == input.dataset.stockid).price
      });
    }
  });
  const paymentType = paymentTypeSelect.value;
  const borrowerName = borrowerNameInput.value;

  if (paymentType === "borrow" && !borrowerName) {
    alert("Enter borrower name for borrow payment");
    return;
  }

  const res = await addSale({ items, paymentType, borrowerName });
  if (res && res.success) {
    alert("Sale added successfully");
    saleForm.reset();
    loadStock();
  }
});

// Initial load
loadStock();
