import { Pool } from "pg";

export const dynamic = "force-dynamic";

/* ---------- DB CONNECTION (Neon PostgreSQL) ---------- */
let pool;

function getDB() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

/* ---------- API ROUTE ---------- */
export async function GET() {
  const db = getDB();

  const { rows } = await db.query(`
    SELECT 
      b.id,
      b.name,
      SUM(s.total_amount)
      - COALESCE(
          (SELECT SUM(amount)
           FROM borrower_payments bp
           WHERE bp.borrower_id = b.id),
        0
      ) AS due
    FROM borrowers b
    JOIN sales s ON s.borrower_id = b.id
    GROUP BY b.id, b.name
    HAVING 
      SUM(s.total_amount)
      - COALESCE(
          (SELECT SUM(amount)
           FROM borrower_payments bp
           WHERE bp.borrower_id = b.id),
        0
      ) > 0
  `);

  return Response.json(rows);
}
