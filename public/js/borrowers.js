async function loadBorrowers() {
  const res = await fetch('/api/borrowers');
  const data = await res.json();

  const box = document.getElementById('borrowerList');
  box.innerHTML = '';

  data.forEach(b => {
    box.innerHTML += `
      <div class="card">
        <h3>${b.name}</h3>
        <p>Total Due: ₹${b.total_due}</p>
        <button class="action-btn" onclick="viewBorrower(${b.id})">View</button>
      </div>
    `;
  });
}

async function viewBorrower(id) {
  const res = await fetch(`/api/borrowers/${id}`);
  const data = await res.json();

  let html = `<h3>${data.name}</h3>`;
  data.items.forEach(i => {
    html += `<p>${i.date} | ${i.product} | ₹${i.amount}</p>`;
  });

  html += `
    <input type="number" id="payAmount" placeholder="Pay amount">
    <select id="payType">
      <option value="cash">Cash</option>
      <option value="online">Online</option>
    </select>
    <button class="action-btn" onclick="payBorrow(${id})">Pay</button>
  `;

  document.getElementById('borrowerList').innerHTML = html;
}

async function payBorrow(id) {
  await fetch(`/api/borrowers/pay/${id}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      amount: Number(document.getElementById('payAmount').value),
      type: document.getElementById('payType').value
    })
  });

  alert('Payment added');
  loadBorrowers();
}

loadBorrowers();
