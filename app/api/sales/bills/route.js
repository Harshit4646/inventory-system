import mysql from "mysql2/promise";

/* ---------- DB CONNECTION (Railway MySQL) ---------- */
let pool;

function getDB() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return pool;
}

/* ---------- API ROUTE: LAST 7 DAYS SALES ---------- */
export async function GET() {
  try {
    const db = getDB();

    /* PostgreSQL: last 7 days from today */
    const result = await db.query(
      `
      SELECT id, sale_date, total_amount, payment_type
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY sale_date DESC
      `
    );

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
