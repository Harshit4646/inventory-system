import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT b.id, b.name,
    IFNULL(SUM(s.total_amount),0) -
    IFNULL((SELECT SUM(amount) FROM borrower_payments bp WHERE bp.borrower_id=b.id),0)
    AS due
    FROM borrowers b
    LEFT JOIN sales s ON s.borrower_id=b.id
    GROUP BY b.id
  `);
  return Response.json(rows);
}
