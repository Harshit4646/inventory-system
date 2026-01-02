fetch("/api/expired")
  .then(r => r.json())
  .then(d => {
    document.getElementById("expired").innerHTML =
      `<tr><th>Name</th><th>Price</th><th>Qty</th><th>Expiry</th></tr>` +
      d.map(e => `
        <tr>
          <td>${e.name}</td>
          <td>${e.price}</td>
          <td>${e.quantity}</td>
          <td>${e.expiry_date}</td>
        </tr>
      `).join("");
  });
