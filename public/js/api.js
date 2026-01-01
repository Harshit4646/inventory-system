const BASE_URL = "/api"; // Vercel serverless API base

// Generic GET
export async function getData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (err) {
    console.error("GET Error:", err);
    return null;
  }
}

// Generic POST
export async function postData(endpoint, data) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to post");
    return await res.json();
  } catch (err) {
    console.error("POST Error:", err);
    return null;
  }
}

// Helper for daily/monthly dashboard numbers
export async function getDashboard() {
  return await getData("dashboard");
}

// Helper for stock
export async function getStock() {
  return await getData("stock");
}

export async function addStock(item) {
  return await postData("stock", item);
}

// Helper for sales
export async function addSale(sale) {
  return await postData("sales", sale);
}

// Helper for borrowers
export async function getBorrowers() {
  return await getData("borrowers");
}

export async function payBorrower(payment) {
  return await postData("borrowers", payment);
}

// Helper for expired
export async function getExpired() {
  return await getData("expired");
}
