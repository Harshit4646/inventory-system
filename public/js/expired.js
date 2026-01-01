import { getExpired } from "./api.js";

const expiredTable = document.getElementById("expiredTable");

async function loadExpired() {
  const expired = await getExpired();
  expiredTable.innerHTML = "";
  expired.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.expiry}</td>
    `;
    expiredTable.appendChild(tr);
  });
}

loadExpired();
