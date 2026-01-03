import { Pool } from "pg";

/* ---------- DB CONNECTION ---------- */
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
  try {
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

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
