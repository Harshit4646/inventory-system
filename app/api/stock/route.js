import { Pool } from "pg";

/* ---------- DB CONNECTION ---------- */
let pool;

function getDB() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

/* ---------- API ROUTE: STOCK ---------- */
export async function GET() {
  try {
    const db = getDB();

    const result = await db.query(
      `
      SELECT s.id, p.name, s.quantity, s.price, s.expiry_date
      FROM stock s
      JOIN products p ON p.id = s.product_id
      WHERE s.quantity > 0
      ORDER BY p.name
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

export async function POST(req) {
  try {
    const { product_id, quantity, price, expiry_date } = await req.json();
    const db = getDB();

    await db.query(
      `
      INSERT INTO stock (product_id, quantity, price, expiry_date)
      VALUES ($1, $2, $3, $4)
      `,
      [product_id, quantity, price, expiry_date || null]
    );

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
