import { Pool } from "pg";

export const dynamic = "force-dynamic";

/* ---------- DB CONNECTION (Neon PostgreSQL) ---------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/* ---------- API ROUTE: EXPIRED STOCK ---------- */
export async function GET() {
  const client = await pool.connect();

  try {
    /* ---------- BEGIN TRANSACTION ---------- */
    await client.query("BEGIN");

    /* ---------- MOVE EXPIRED STOCK ---------- */
    await client.query(`
      INSERT INTO expired_stock
        (product_id, quantity, price, expiry_date, expired_at)
      SELECT
        product_id,
        quantity,
        price,
        expiry_date,
        CURRENT_TIMESTAMP
      FROM stock
      WHERE expiry_date IS NOT NULL
        AND expiry_date < CURRENT_DATE
    `);

    /* ---------- DELETE FROM STOCK ---------- */
    await client.query(`
      DELETE FROM stock
      WHERE expiry_date IS NOT NULL
        AND expiry_date < CURRENT_DATE
    `);

    /* ---------- FETCH ALL EXPIRED STOCK ---------- */
    const result = await client.query(`
      SELECT
        e.id,
        p.name,
        e.quantity,
        e.price,
        e.expiry_date,
        e.expired_at
      FROM expired_stock e
      JOIN products p ON p.id = e.product_id
      ORDER BY e.expired_at DESC
    `);

    /* ---------- COMMIT ---------- */
    await client.query("COMMIT");

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    await client.query("ROLLBACK");

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );

  } finally {
    client.release();
  }
                                      }
