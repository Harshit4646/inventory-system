async function loadBills() {
  const res = await fetch('/api/sales/bills');
  const data = await res.json();

  const box = document.getElementById('bills');
  box.innerHTML = '';

  data.forEach(b => {
    box.innerHTML += `
      <div class="card">
        <p>Date: ${b.date}</p>
        <p>Total: ₹${b.total}</p>
        ${b.editable ? `<button class="action-btn">Edit</button>` : ''}
      </div>
    `;
  });
}

loadBills();
