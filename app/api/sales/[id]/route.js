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

/* ---------- API ROUTE: DELETE SALE ---------- */
export async function DELETE(_, { params }) {
  const db = getDB();
  const saleId = params.id;

  const client = await db.connect();

  try {
    /* ---------- BEGIN TRANSACTION ---------- */
    await client.query("BEGIN");

    /* ---------- GET SALE ITEMS ---------- */
    const itemsResult = await client.query(
      `SELECT quantity, stock_id FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    /* ---------- ROLLBACK STOCK ---------- */
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE stock
         SET quantity = quantity + $1
         WHERE id = $2`,
        [item.quantity, item.stock_id]
      );
    }

    /* ---------- DELETE SALE ITEMS ---------- */
    await client.query(
      `DELETE FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    /* ---------- DELETE SALE ---------- */
    await client.query(
      `DELETE FROM sales WHERE id = $1`,
      [saleId]
    );

    /* ---------- COMMIT ---------- */
    await client.query("COMMIT");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

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
