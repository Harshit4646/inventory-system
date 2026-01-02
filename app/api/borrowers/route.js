import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT b.id, b.name,
    SUM(s.total_amount) -
    IFNULL((SELECT SUM(amount) FROM borrower_payments bp WHERE bp.borrower_id=b.id),0)
    AS due
    FROM borrowers b
    JOIN sales s ON s.borrower_id=b.id
    GROUP BY b.id
    HAVING due > 0
  `);
  return Response.json(rows);
}
