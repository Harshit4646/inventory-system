import { getDashboard } from "./api.js";

const dailyTotal = document.getElementById("dailyTotal");
const dailyCash = document.getElementById("dailyCash");
const dailyOnline = document.getElementById("dailyOnline");
const monthlyTotal = document.getElementById("monthlyTotal");
const monthlyCash = document.getElementById("monthlyCash");
const monthlyOnline = document.getElementById("monthlyOnline");

async function loadDashboard() {
  const data = await getDashboard();
  if (!data) return;

  dailyTotal.innerText = data.daily.total || 0;
  dailyCash.innerText = data.daily.cash || 0;
  dailyOnline.innerText = data.daily.online || 0;

  monthlyTotal.innerText = data.monthly.total || 0;
  monthlyCash.innerText = data.monthly.cash || 0;
  monthlyOnline.innerText = data.monthly.online || 0;
}

loadDashboard();
