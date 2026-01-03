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

/* ---------- API ROUTE: EDIT SALE ---------- */
export async function PUT(req, { params }) {
  const db = getDB();
  const saleId = params.id;

  try {
    const { items, total_amount } = await req.json();

    /* ---------- CHECK 7-DAY WINDOW ---------- */
    const saleResult = await db.query(
      `SELECT sale_date FROM sales WHERE id = $1`,
      [saleId]
    );

    if (saleResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Sale not found" }),
        { status: 404 }
      );
    }

    const saleDate = new Date(saleResult.rows[0].sale_date);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (saleDate < sevenDaysAgo) {
      return new Response(
        JSON.stringify({ error: "Edit window expired" }),
        { status: 403 }
      );
    }

    /* ---------- BEGIN TRANSACTION ---------- */
    await db.query("BEGIN");

    /* ---------- ROLLBACK OLD ITEMS ---------- */
    const oldItemsResult = await db.query(
      `SELECT * FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    for (const i of oldItemsResult.rows) {
      await db.query(
        `UPDATE stock SET quantity = quantity + $1 WHERE id = $2`,
        [i.quantity, i.stock_id]
      );
    }

    /* ---------- DELETE OLD SALE ITEMS ---------- */
    await db.query(
      `DELETE FROM sale_items WHERE sale_id = $1`,
      [saleId]
    );

    /* ---------- INSERT NEW SALE ITEMS + UPDATE STOCK ---------- */
    for (const i of items) {
      await db.query(
        `
        INSERT INTO sale_items
          (sale_id, stock_id, product_id, quantity, price)
        VALUES
          ($1, $2, $3, $4, $5)
        `,
        [saleId, i.stock_id, i.product_id, i.quantity, i.price]
      );

      await db.query(
        `UPDATE stock SET quantity = quantity - $1 WHERE id = $2`,
        [i.quantity, i.stock_id]
      );
    }

    /* ---------- UPDATE SALE TOTAL ---------- */
    await db.query(
      `UPDATE sales SET total_amount = $1 WHERE id = $2`,
      [total_amount, saleId]
    );

    /* ---------- COMMIT TRANSACTION ---------- */
    await db.query("COMMIT");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    await db.query("ROLLBACK");
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
