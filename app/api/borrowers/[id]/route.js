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
export async function GET(_, { params }) {
  try {
    const db = getDB();
    const borrowerId = params.id;

    /* -------- Borrowed Sales -------- */
    const salesResult = await db.query(
      `
      SELECT
        s.id,
        s.sale_date,
        si.quantity,
        si.price,
        p.name
      FROM sales s
      JOIN sale_items si ON si.sale_id = s.id
      JOIN products p ON p.id = si.product_id
      WHERE s.borrower_id = $1
      ORDER BY s.sale_date DESC
      `,
      [borrowerId]
    );

    /* -------- Borrower Payments -------- */
    const paymentsResult = await db.query(
      `
      SELECT 
        amount,
        payment_mode,
        payment_date
      FROM borrower_payments
      WHERE borrower_id = $1
      ORDER BY payment_date DESC
      `,
      [borrowerId]
    );

    return new Response(
      JSON.stringify({
        sales: salesResult.rows,
        payments: paymentsResult.rows
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
