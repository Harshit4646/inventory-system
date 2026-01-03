let stockData = [];
let selectedItem = null;
let billItems = [];
let totalAmount = 0;

/* -------- LOAD STOCK -------- */
async function loadStock() {
  const res = await fetch("/api/stock");
  stockData = await res.json();

  const box = document.getElementById("stockList");
  box.innerHTML = "";

  stockData.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} | ₹${item.price} | Exp: ${item.expiry_date || "N/A"}`;
    div.style.cursor = "pointer";
    div.onclick = () => {
      selectedItem = item;
      document.getElementById("selectedProduct").innerText = item.name;
    };
    box.appendChild(div);
  });
}

/* -------- ADD PRODUCT -------- */
function addProduct() {
  if (!selectedItem) return alert("Select product");

  const qty = Number(document.getElementById("quantity").value);
  if (qty <= 0) return alert("Invalid quantity");

  billItems.push({
    stock_id: selectedItem.id,
    product_id: selectedItem.product_id,
    name: selectedItem.name,
    quantity: qty,
    price: selectedItem.price
  });

  selectedItem = null;
  document.getElementById("quantity").value = "";
  document.getElementById("selectedProduct").innerText = "None";

  renderBill();
}

/* -------- RENDER BILL -------- */
function renderBill() {
  const tbody = document.getElementById("billTable");
  tbody.innerHTML = "";
  totalAmount = 0;

  billItems.forEach((item, index) => {
    const rowTotal = item.quantity * item.price;
    totalAmount += rowTotal;

    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${rowTotal}</td>
        <td><button onclick="removeItem(${index})">X</button></td>
      </tr>
    `;
  });

  document.getElementById("total").innerText = totalAmount;
}

function removeItem(i) {
  billItems.splice(i, 1);
  renderBill();
}

/* -------- SAVE SALE -------- */
async function saveSale() {
  if (billItems.length === 0) return alert("No items");

  const payment_type = document.getElementById("paymentType").value;
  const borrower_name =
    payment_type === "BORROW"
      ? document.getElementById("borrowerName").value
      : null;

  const res = await fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: billItems,
      payment_type,
      borrower_name,
      sale_date: new Date()
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("Sale saved");
    billItems = [];
    renderBill();
  } else {
    alert(data.error);
  }
}

loadStock();
