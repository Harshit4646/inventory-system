let productsCache = [];
let selectedProductId = null;

/* ---------------- LOAD STOCK ---------------- */
async function loadStock() {
  const res = await fetch('/api/stock');
  const data = await res.json();
  renderStock(data);
}

function renderStock(data) {
  const tbody = document.getElementById('stockTable');
  tbody.innerHTML = '';

  const today = new Date();

  data.forEach(item => {
    const exp = new Date(item.expiry_date);
    let cls = '';

    if (exp < today) cls = 'expired';
    else if ((exp - today) / (1000*60*60*24) <= 7) cls = 'near-expiry';

    tbody.innerHTML += `
      <tr class="${cls}">
        <td>${item.product_name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.expiry_date}</td>
      </tr>
    `;
  });
}

/* ---------------- SEARCH STOCK ---------------- */
document.getElementById('stockSearch').addEventListener('input', async e => {
  const q = e.target.value;
  const res = await fetch(`/api/stock?search=${q}`);
  const data = await res.json();
  renderStock(data);
});

/* ---------------- PRODUCT SEARCH (ADD STOCK) ---------------- */
document.getElementById('productSearch').addEventListener('input', async e => {
  const q = e.target.value;
  if (!q) return;

  const res = await fetch(`/api/products?search=${q}`);
  productsCache = await res.json();

  const box = document.getElementById('productSuggestions');
  box.innerHTML = '';

  productsCache.forEach(p => {
    const div = document.createElement('div');
    div.textContent = p.name;
    div.style.cursor = 'pointer';
    div.onclick = () => {
      document.getElementById('productSearch').value = p.name;
      selectedProductId = p.id;
      box.innerHTML = '';
    };
    box.appendChild(div);
  });
});

/* ---------------- ADD STOCK ---------------- */
async function addStock() {
  if (!selectedProductId) {
    alert('Select product from list');
    return;
  }

  const body = {
    product_id: selectedProductId,
    price: Number(document.getElementById('price').value),
    quantity: Number(document.getElementById('quantity').value),
    expiry_date: document.getElementById('expiry').value
  };

  await fetch('/api/stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  document.getElementById('price').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('expiry').value = '';
  document.getElementById('productSearch').value = '';
  selectedProductId = null;

  loadStock();
}

loadStock();
