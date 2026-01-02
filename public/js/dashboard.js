fetch("/api/dashboard")
  .then(r => r.json())
  .then(d => {
    document.getElementById("daily").innerHTML = `
      <h3>Daily Sales</h3>
      Total: ₹${d.daily.total}<br>
      Cash: ₹${d.daily.cash}<br>
      Online: ₹${d.daily.online}
    `;

    document.getElementById("monthly").innerHTML = `
      <h3>Monthly Sales</h3>
      Total: ₹${d.monthly.total}<br>
      Cash: ₹${d.monthly.cash}<br>
      Online: ₹${d.monthly.online}
    `;
  });
