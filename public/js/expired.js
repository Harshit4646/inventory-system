async function loadExpired() {
  const res = await fetch('/api/stock/expired');
  const data = await res.json();

  const tbody = document.getElementById('expiredTable');
  tbody.innerHTML = '';

  data.forEach(i => {
    tbody.innerHTML += `
      <tr class="expired">
        <td>${i.product_name}</td>
        <td>₹${i.price}</td>
        <td>${i.quantity}</td>
        <td>${i.expiry_date}</td>
      </tr>
    `;
  });
}

loadExpired();
