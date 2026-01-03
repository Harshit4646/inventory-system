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
  try {
    const db = getDB();

    /* -------- Daily Sales -------- */
    const dailySalesResult = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN payment_type = 'CASH' THEN total_amount END), 0) AS cash,
        COALESCE(SUM(CASE WHEN payment_type = 'ONLINE' THEN total_amount END), 0) AS online,
        COALESCE(SUM(CASE WHEN payment_type = 'BORROW' THEN total_amount END), 0) AS borrow
      FROM sales
      WHERE sale_date::date = CURRENT_DATE
    `);

    /* -------- Monthly Sales -------- */
    const monthlySalesResult = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN payment_type = 'CASH' THEN total_amount END), 0) AS cash,
        COALESCE(SUM(CASE WHEN payment_type = 'ONLINE' THEN total_amount END), 0) AS online,
        COALESCE(SUM(CASE WHEN payment_type = 'BORROW' THEN total_amount END), 0) AS borrow
      FROM sales
      WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    /* -------- Daily Borrow Payments -------- */
    const dailyBorrowPaidResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS paid
      FROM borrower_payments
      WHERE payment_date::date = CURRENT_DATE
    `);

    /* -------- Monthly Borrow Payments -------- */
    const monthlyBorrowPaidResult = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS paid
      FROM borrower_payments
      WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    return new Response(
      JSON.stringify({
        daily: {
          cash: dailySalesResult.rows[0].cash,
          online: dailySalesResult.rows[0].online,
          borrow: dailySalesResult.rows[0].borrow,
          borrow_paid: dailyBorrowPaidResult.rows[0].paid
        },
        monthly: {
          cash: monthlySalesResult.rows[0].cash,
          online: monthlySalesResult.rows[0].online,
          borrow: monthlySalesResult.rows[0].borrow,
          borrow_paid: monthlyBorrowPaidResult.rows[0].paid
        }
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


