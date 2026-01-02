let stockData = [];

fetch("/api/stock")
  .then(r => r.json())
  .then(d => {
    stockData = d;
    render(d);
  });

function render(data) {
  document.getElementById("stockTable").innerHTML =
    `<tr><th>Name</th><th>Price</th><th>Qty</th><th>Expiry</th></tr>` +
    data.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.price}</td>
        <td>${s.quantity}</td>
        <td>${s.expiry_date}</td>
      </tr>
    `).join("");
}

document.getElementById("search").oninput = e => {
  const v = e.target.value.toLowerCase();
  render(stockData.filter(s => s.name.toLowerCase().includes(v)));
};

function addStock() {
  fetch("/api/stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      price: price.value,
      quantity: qty.value,
      expiry_date: expiry.value
    })
  }).then(() => location.reload());
}
