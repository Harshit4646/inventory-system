import { getBorrowers, payBorrower } from "./api.js";

const borrowerTable = document.getElementById("borrowerTable");

async function loadBorrowers() {
  const borrowers = await getBorrowers();
  borrowerTable.innerHTML = "";
  borrowers.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.balance}</td>
      <td>
        <button onclick="pay('${b.name}')">Pay</button>
      </td>
    `;
    borrowerTable.appendChild(tr);
  });
}

window.pay = async (name) => {
  const cash = parseInt(prompt("Cash paid:", "0")) || 0;
  const online = parseInt(prompt("Online paid:", "0")) || 0;
  const discount = parseInt(prompt("Discount:", "0")) || 0;

  await payBorrower({ name, paidCash: cash, paidOnline: online, paidDiscount: discount });
  loadBorrowers();
};

// Initial load
loadBorrowers();
