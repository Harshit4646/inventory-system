let items = [];

function submitSale() {
  fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      type: type.value,
      borrower: buyer.value
    })
  }).then(() => alert("Sale added"));
}
