import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();

  const [[dailySales]] = await db.query(`
    SELECT
      SUM(CASE WHEN payment_type='CASH' THEN total_amount ELSE 0 END) cash,
      SUM(CASE WHEN payment_type='ONLINE' THEN total_amount ELSE 0 END) online,
      SUM(CASE WHEN payment_type='BORROW' THEN total_amount ELSE 0 END) borrow
    FROM sales
    WHERE sale_date = CURDATE()
  `);

  const [[monthlySales]] = await db.query(`
    SELECT
      SUM(CASE WHEN payment_type='CASH' THEN total_amount ELSE 0 END) cash,
      SUM(CASE WHEN payment_type='ONLINE' THEN total_amount ELSE 0 END) online,
      SUM(CASE WHEN payment_type='BORROW' THEN total_amount ELSE 0 END) borrow
    FROM sales
    WHERE MONTH(sale_date)=MONTH(CURDATE())
    AND YEAR(sale_date)=YEAR(CURDATE())
  `);

  const [[dailyBorrowPaid]] = await db.query(`
    SELECT SUM(amount) paid
    FROM borrower_payments
    WHERE payment_date = CURDATE()
  `);

  const [[monthlyBorrowPaid]] = await db.query(`
    SELECT SUM(amount) paid
    FROM borrower_payments
    WHERE MONTH(payment_date)=MONTH(CURDATE())
    AND YEAR(payment_date)=YEAR(CURDATE())
  `);

  return Response.json({
    daily: {
      cash: dailySales.cash || 0,
      online: dailySales.online || 0,
      borrow: dailySales.borrow || 0,
      borrow_paid: dailyBorrowPaid.paid || 0
    },
    monthly: {
      cash: monthlySales.cash || 0,
      online: monthlySales.online || 0,
      borrow: monthlySales.borrow || 0,
      borrow_paid: monthlyBorrowPaid.paid || 0
    }
  });
}
