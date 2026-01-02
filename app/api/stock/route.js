import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT s.id, p.name, s.quantity, s.price, s.expiry_date
    FROM stock s
    JOIN products p ON p.id=s.product_id
    WHERE s.quantity > 0
    ORDER BY p.name
  `);
  return Response.json(rows);
}

export async function POST(req) {
  const { product_id, quantity, price, expiry_date } = await req.json();
  const db = getDB();

  await db.query(
    "INSERT INTO stock (product_id, quantity, price, expiry_date) VALUES (?,?,?,?)",
    [product_id, quantity, price, expiry_date || null]
  );

  return Response.json({ success: true });
}
