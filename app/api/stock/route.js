import { Pool } from "pg";

export const dynamic = "force-dynamic";

/* ---------- DB CONNECTION (Neon PostgreSQL) ---------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/* ---------- API ROUTE: GET STOCK ---------- */
export async function GET() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT 
        s.id,
        p.name,
        s.quantity,
        s.price,
        s.expiry_date
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
  } finally {
    client.release();
  }
}

/* ---------- API ROUTE: ADD STOCK ---------- */
export async function POST(req) {
  const client = await pool.connect();

  try {
    const { product_id, quantity, price, expiry_date } = await req.json();

    await client.query(
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
  } finally {
    client.release();
  }
      }
