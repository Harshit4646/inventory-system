import pool from "../../../../db/connection";

export const dynamic = "force-dynamic";

/* List borrowers */
export async function GET() {
  const [rows] = await pool.query(
    "SELECT * FROM borrowers WHERE total_due > 0"
  );
  return Response.json(rows);
}

/* Payment */
export async function POST(req) {
  const { borrower_id, amount, mode } = await req.json();

  await pool.query(
    `INSERT INTO payments(borrower_id,amount,mode)
     VALUES(?,?,?)`,
    [borrower_id, amount, mode]
  );

  await pool.query(
    `UPDATE borrowers SET total_due=total_due-? WHERE id=?`,
    [amount, borrower_id]
  );

  await pool.query(
    `DELETE FROM borrowers WHERE total_due<=0`
  );

  return Response.json({ success: true });
}
