import { getDB } from "@/db/connection";

export async function GET(_, { params }) {
  const db = getDB();
  const borrowerId = params.id;

  const [sales] = await db.query(`
    SELECT
      s.id,
      s.sale_date,
      si.quantity,
      si.price,
      p.name
    FROM sales s
    JOIN sale_items si ON si.sale_id=s.id
    JOIN products p ON p.id=si.product_id
    WHERE s.borrower_id=?
    ORDER BY s.sale_date DESC
  `, [borrowerId]);

  const [payments] = await db.query(`
    SELECT amount, payment_mode, payment_date
    FROM borrower_payments
    WHERE borrower_id=?
    ORDER BY payment_date DESC
  `, [borrowerId]);

  return Response.json({ sales, payments });
}
