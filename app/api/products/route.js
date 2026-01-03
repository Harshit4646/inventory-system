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

/* ---------- GET: LIST PRODUCTS ---------- */
export async function GET() {
  try {
    const db = getDB();

    const { rows } = await db.query(
      `SELECT * FROM products ORDER BY name`
    );

    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

/* ---------- POST: ADD PRODUCT ---------- */
export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ error: "Name required" }),
        { status: 400 }
      );
    }

    const db = getDB();

    /* 
      PostgreSQL replacement for:
      INSERT IGNORE INTO products (name) VALUES (?)
    */
    await db.query(
      `
      INSERT INTO products (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
      `,
      [name]
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
