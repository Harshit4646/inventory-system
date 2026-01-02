let selectedStockId = null;

document.getElementById('saleProductSearch').addEventListener('input', async e => {
  const q = e.target.value;
  if (!q) return;

  const res = await fetch(`/api/stock?search=${q}`);
  const data = await res.json();

  const box = document.getElementById('saleProductList');
  box.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `${item.product_name} | ₹${item.price} | Exp ${item.expiry_date}`;
    div.onclick = () => {
      selectedStockId = item.id;
      document.getElementById('saleProductSearch').value = item.product_name;
      box.innerHTML = '';
    };
    box.appendChild(div);
  });
});

async function addSale() {
  const body = {
    stock_id: selectedStockId,
    quantity: Number(document.getElementById('saleQty').value),
    payment_type: document.getElementById('paymentType').value,
    borrower_name: document.getElementById('borrowerName').value || null
  };

  await fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  alert('Sale Added');
  location.reload();
}
