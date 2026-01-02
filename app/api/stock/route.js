import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();
  const [rows] = await db.query(`
    SELECT s.id, p.name, s.quantity, s.expiry_date
    FROM stock s
    JOIN products p ON p.id = s.product_id
    ORDER BY p.name
  `);
  return Response.json(rows);
}

export async function POST(req) {
  const { product_id, quantity, expiry_date } = await req.json();
  const db = getDB();

  await db.query(
    "INSERT INTO stock (product_id, quantity, expiry_date) VALUES (?,?,?)",
    [product_id, quantity, expiry_date || null]
  );

  return Response.json({ success: true });
}
