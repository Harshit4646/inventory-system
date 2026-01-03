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
    const result = await client.query(`
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
    `);

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    client.release();
  }
}

/* ---------- API ROUTE: ADD STOCK (Smart) ---------- */
export async function POST(req) {
  const client = await pool.connect();

  try {
    const { name, quantity, price, expiry_date } = await req.json();

    // 1️⃣ Check if product exists
    let productResult = await client.query(
      `SELECT id FROM products WHERE name = $1`,
      [name]
    );

    let productId;
    if (productResult.rows.length > 0) {
      // Product exists
      productId = productResult.rows[0].id;

      // 2️⃣ Increase stock if exists
      await client.query(
        `
        UPDATE stock
        SET quantity = quantity + $1, price = $2
        WHERE product_id = $3
        `,
        [quantity, price, productId]
      );

    } else {
      // Product does not exist → insert product
      const insertProduct = await client.query(
        `INSERT INTO products (name) VALUES ($1) RETURNING id`,
        [name]
      );
      productId = insertProduct.rows[0].id;

      // 3️⃣ Insert new stock
      await client.query(
        `
        INSERT INTO stock (product_id, quantity, price, expiry_date)
        VALUES ($1, $2, $3, $4)
        `,
        [productId, quantity, price, expiry_date || null]
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    client.release();
  }
}
