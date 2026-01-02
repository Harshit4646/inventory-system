import pool from "../../../../db/connection";

export const dynamic = "force-dynamic";

/* GET stock */
export async function GET() {
  const [rows] = await pool.query(`
    SELECT s.id, p.name, s.price, s.quantity, s.expiry_date
    FROM stock s
    JOIN products p ON p.id = s.product_id
    WHERE s.quantity > 0
    ORDER BY p.name
  `);
  return Response.json(rows);
}

/* ADD stock */
export async function POST(req) {
  const { name, price, quantity, expiry_date } = await req.json();

  let [[product]] = await pool.query(
    "SELECT id FROM products WHERE name=?",
    [name]
  );

  let productId;
  if (!product) {
    const [res] = await pool.query(
      "INSERT INTO products(name) VALUES(?)",
      [name]
    );
    productId = res.insertId;
  } else {
    productId = product.id;
  }

  await pool.query(
    `INSERT INTO stock(product_id,price,quantity,expiry_date)
     VALUES(?,?,?,?)`,
    [productId, price, quantity, expiry_date]
  );

  return Response.json({ success: true });
}
