import mysql from "mysql2/promise";
export const dynamic = "force-dynamic";
/* ---------- DB CONNECTION (Railway MySQL) ---------- */
let pool;

function getDB() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
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
    GROUP BY b.id
    HAVING 
      SUM(s.total_amount)
      - COALESCE(
          (SELECT SUM(amount)
           FROM borrower_payments bp
           WHERE bp.borrower_id = b.id),
        0
      ) > 0
  `);

  return new Response(JSON.stringify(rows), {
    headers: { "Content-Type": "application/json" }
  });
}


