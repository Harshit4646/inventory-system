import { getStock, addStock } from "./api.js";

const stockTable = document.getElementById("stockTable");
const searchInput = document.getElementById("stockSearch");
const addForm = document.getElementById("addStockForm");

let stockData = [];

// Fetch and render stock
async function loadStock() {
  stockData = await getStock();
  renderStock(stockData);
}

function renderStock(data) {
  stockTable.innerHTML = "";
  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>${item.expiry}</td>
    `;
    stockTable.appendChild(tr);
  });
}

// Search function
searchInput.addEventListener("input", (e) => {
  const filtered = stockData.filter(item =>
    item.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderStock(filtered);
});

// Add stock
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const item = {
    name: formData.get("name"),
    price: parseInt(formData.get("price")),
    quantity: parseInt(formData.get("quantity")),
    expiry: formData.get("expiry")
  };
  const res = await addStock(item);
  if (res && res.success) {
    loadStock();
    addForm.reset();
  }
});

// Initial load
loadStock();
