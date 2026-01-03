let productsCache = [];

/* ---------------- LOAD STOCK ---------------- */
async function loadStock() {
  try {
    const res = await fetch('/api/stock');
    const data = await res.json();
    renderStock(data);
  } catch (error) {
    console.error('Error loading stock:', error);
  }
}

function renderStock(data) {
  const tbody = document.getElementById('stockTable');
  tbody.innerHTML = '';

  const today = new Date();

  data.forEach(item => {
    const exp = item.expiry_date ? new Date(item.expiry_date) : null;
    let cls = '';

    if (exp && exp < today) cls = 'expired';
    else if (exp && (exp - today) / (1000 * 60 * 60 * 24) <= 7) cls = 'near-expiry';

    tbody.innerHTML += `
      <tr class="${cls}">
        <td>${item.product_name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.expiry_date || '-'}</td>
      </tr>
    `;
  });
}

/* ---------------- SEARCH STOCK ---------------- */
document.getElementById('stockSearch').addEventListener('input', async e => {
  const q = e.target.value.trim();
  try {
    const res = await fetch(`/api/stock?search=${q}`);
    const data = await res.json();
    renderStock(data);
  } catch (error) {
    console.error('Error searching stock:', error);
  }
});

/* ---------------- PRODUCT SEARCH (ADD STOCK) ---------------- */
document.getElementById('productSearch').addEventListener('input', async e => {
  const q = e.target.value.trim();
  if (!q) return;

  try {
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
        box.innerHTML = '';
      };
      box.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

/* ---------------- ADD STOCK ---------------- */
async function addStock() {
  const productName = document.getElementById('productSearch').value.trim();
  const price = Number(document.getElementById('price').value);
  const quantity = Number(document.getElementById('quantity').value);
  const expiry_date = document.getElementById('expiry').value;

  if (!productName) {
    alert('Enter product name');
    return;
  }
  if (!price || !quantity) {
    alert('Enter valid price and quantity');
    return;
  }

  const body = { name: productName, price, quantity, expiry_date };

  try {
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    if (result.success) {
      document.getElementById('price').value = '';
      document.getElementById('quantity').value = '';
      document.getElementById('expiry').value = '';
      document.getElementById('productSearch').value = '';
      loadStock();
    } else {
      alert(result.error || 'Failed to add stock');
    }
  } catch (error) {
    console.error('Error adding stock:', error);
  }
}

/* ---------------- INITIAL LOAD ---------------- */
loadStock();
