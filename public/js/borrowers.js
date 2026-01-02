fetch("/api/borrowers")
  .then(r => r.json())
  .then(d => {
    document.getElementById("borrowers").innerHTML =
      `<tr><th>Name</th><th>Due</th></tr>` +
      d.map(b => `
        <tr>
          <td>${b.name}</td>
          <td>${b.total_due}</td>
        </tr>
      `).join("");
  });
