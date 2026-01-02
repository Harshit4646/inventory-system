function goPage(page) {
  switch(page) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'stock':
      loadStock();
      break;
    case 'sales':
      loadSales();
      break;
    case 'borrowers':
      loadBorrowers();
      break;
    case 'expired':
      loadExpired();
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});
