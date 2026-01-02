import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();

  const [daily] = await db.query(`
    SELECT 
      IFNULL(SUM(CASE WHEN payment_type='CASH' THEN total_amount END),0) AS cash,
      IFNULL(SUM(CASE WHEN payment_type='ONLINE' THEN total_amount END),0) AS online,
      IFNULL(SUM(CASE WHEN payment_type='BORROW' THEN total_amount END),0) AS borrow
    FROM sales
    WHERE DATE(sale_date) = CURDATE()
  `);

  const [monthly] = await db.query(`
    SELECT 
      IFNULL(SUM(CASE WHEN payment_type='CASH' THEN total_amount END),0) AS cash,
      IFNULL(SUM(CASE WHEN payment_type='ONLINE' THEN total_amount END),0) AS online,
      IFNULL(SUM(CASE WHEN payment_type='BORROW' THEN total_amount END),0) AS borrow
    FROM sales
    WHERE MONTH(sale_date)=MONTH(CURDATE())
    AND YEAR(sale_date)=YEAR(CURDATE())
  `);

  const [borrowPaymentsDaily] = await db.query(`
    SELECT IFNULL(SUM(amount),0) AS paid
    FROM borrower_payments
    WHERE DATE(payment_date)=CURDATE()
  `);

  const [borrowPaymentsMonthly] = await db.query(`
    SELECT IFNULL(SUM(amount),0) AS paid
    FROM borrower_payments
    WHERE MONTH(payment_date)=MONTH(CURDATE())
    AND YEAR(payment_date)=YEAR(CURDATE())
  `);

  return Response.json({
    daily: {
      ...daily[0],
      borrow_paid: borrowPaymentsDaily[0].paid
    },
    monthly: {
      ...monthly[0],
      borrow_paid: borrowPaymentsMonthly[0].paid
    }
  });
}
