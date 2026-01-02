import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT id, sale_date, total_amount, payment_type
    FROM sales
    WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY sale_date DESC
  `);

  return Response.json(rows);
}
