import mysql from "mysql2/promise";

/* ---------- DB CONNECTION (Railway MySQL) ---------- */
let pool;

function getDB() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return pool;
}

/* ---------- API ROUTE: DELETE SALE ---------- */
export async function DELETE(_, { params }) {
  const db = getDB();
  const saleId = params.id;

  try {
    /* ---------- BEGIN TRANSACTION ---------- */
    await db.query("BEGIN");

    /* ---------- GET SALE ITEMS ---------- */
    const itemsResult = await db.query(
      `SELECT * FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    /* ---------- ROLLBACK STOCK ---------- */
    for (const i of itemsResult.rows) {
      await db.query(
        `UPDATE stock SET quantity = quantity + $1 WHERE id = $2`,
        [i.quantity, i.stock_id]
      );
    }

    /* ---------- DELETE SALE ITEMS ---------- */
    await db.query(
      `DELETE FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    /* ---------- DELETE SALE ---------- */
    await db.query(
      `DELETE FROM sales WHERE id = $1`,
      [saleId]
    );

    /* ---------- COMMIT TRANSACTION ---------- */
    await db.query("COMMIT");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    /* ---------- ROLLBACK ON ERROR ---------- */
    await db.query("ROLLBACK");

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
