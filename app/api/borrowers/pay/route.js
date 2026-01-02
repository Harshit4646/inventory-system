import { getDB } from "@/db/connection";

export async function POST(req) {
  const { borrower_id, amount, payment_mode, payment_date } = await req.json();
  const db = getDB();

  await db.query(
    "INSERT INTO borrower_payments (borrower_id,amount,payment_mode,payment_date) VALUES (?,?,?,?)",
    [borrower_id, amount, payment_mode, payment_date]
  );

  const [[due]] = await db.query(`
    SELECT
    SUM(s.total_amount) -
    IFNULL((SELECT SUM(amount) FROM borrower_payments WHERE borrower_id=?),0)
    AS due
    FROM sales s
    WHERE s.borrower_id=?
  `, [borrower_id, borrower_id]);

  if (!due.due || due.due <= 0) {
    await db.query("DELETE FROM borrowers WHERE id=?", [borrower_id]);
  }

  return Response.json({ success: true });
}
