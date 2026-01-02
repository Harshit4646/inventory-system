async function loadDashboard() {
  const main = document.getElementById('main-content');
  main.innerHTML = `<div class="card"><h2>Loading...</h2></div>`;

  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    main.innerHTML = `
      <div class="card">
        <h2>Daily Sales</h2>
        <p>Cash: ₹${data.daily.cash.toFixed(2)}</p>
        <p>Online: ₹${data.daily.online.toFixed(2)}</p>
        <p>Borrow: ₹${data.daily.borrow.toFixed(2)}</p>
        <p>Borrow Payments Today: ₹${data.daily.borrow_paid.toFixed(2)}</p>
      </div>
      <div class="card">
        <h2>Monthly Sales</h2>
        <p>Cash: ₹${data.monthly.cash.toFixed(2)}</p>
        <p>Online: ₹${data.monthly.online.toFixed(2)}</p>
        <p>Borrow: ₹${data.monthly.borrow.toFixed(2)}</p>
        <p>Borrow Payments This Month: ₹${data.monthly.borrow_paid.toFixed(2)}</p>
      </div>
    `;
  } catch(err) {
    main.innerHTML = `<div class="card"><h2>Error loading dashboard</h2></div>`;
    console.error(err);
  }
}
