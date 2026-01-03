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

/* ---------- POST: CREATE SALE ---------- */
export async function POST(req) {
  try {
    const { items, payment_type, borrower_name, sale_date } = await req.json();
    const db = getDB();

    let borrowerId = null;

    /* ---------- HANDLE BORROWER ---------- */
    if (payment_type === "BORROW") {
      const borrowerResult = await db.query(
        `SELECT id FROM borrowers WHERE name = $1`,
        [borrower_name]
      );

      if (borrowerResult.rows.length > 0) {
        borrowerId = borrowerResult.rows[0].id;
      } else {
        const insertBorrower = await db.query(
          `INSERT INTO borrowers (name) VALUES ($1) RETURNING id`,
          [borrower_name]
        );
        borrowerId = insertBorrower.rows[0].id;
      }
    }

    /* ---------- CALCULATE TOTAL ---------- */
    const total = items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    /* ---------- INSERT SALE ---------- */
    const saleResult = await db.query(
      `
      INSERT INTO sales
        (sale_date, total_amount, payment_type, borrower_id)
      VALUES
        ($1, $2, $3, $4)
      RETURNING id
      `,
      [sale_date, total, payment_type, borrowerId]
    );

    const saleId = saleResult.rows[0].id;

    /* ---------- INSERT SALE ITEMS + UPDATE STOCK ---------- */
    for (const item of items) {
      await db.query(
        `
        INSERT INTO sale_items
          (sale_id, stock_id, product_id, quantity, price)
        VALUES
          ($1, $2, $3, $4, $5)
        `,
        [saleId, item.stock_id, item.product_id, item.quantity, item.price]
      );

      await db.query(
        `
        UPDATE stock
        SET quantity = quantity - $1
        WHERE id = $2
        `,
        [item.quantity, item.stock_id]
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
      }
