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

/* ---------- API ROUTE: EXPIRED STOCK ---------- */
export async function GET() {
  const db = getDB();

  try {
    /* ---------- BEGIN TRANSACTION ---------- */
    await db.query("BEGIN");

    /* ---------- MOVE EXPIRED STOCK ---------- */
    await db.query(
      `
      INSERT INTO expired_stock (product_id, quantity, price, expiry_date, expired_at)
      SELECT product_id, quantity, price, expiry_date, CURRENT_TIMESTAMP
      FROM stock
      WHERE expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE
      `
    );

    /* ---------- DELETE FROM STOCK ---------- */
    await db.query(
      `
      DELETE FROM stock
      WHERE expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE
      `
    );

    /* ---------- FETCH ALL EXPIRED STOCK ---------- */
    const result = await db.query(
      `
      SELECT e.id, p.name, e.quantity, e.price, e.expiry_date, e.expired_at
      FROM expired_stock e
      JOIN products p ON p.id = e.product_id
      ORDER BY e.expired_at DESC
      `
    );

    /* ---------- COMMIT ---------- */
    await db.query("COMMIT");

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
