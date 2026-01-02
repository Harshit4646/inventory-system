import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();

  await db.query(`
    INSERT INTO expired_stock (product_id, quantity, price, expiry_date)
    SELECT product_id, quantity, price, expiry_date
    FROM stock
    WHERE expiry_date IS NOT NULL AND expiry_date < CURDATE()
  `);

  await db.query(`
    DELETE FROM stock
    WHERE expiry_date IS NOT NULL AND expiry_date < CURDATE()
  `);

  const [rows] = await db.query(`
    SELECT e.id, p.name, e.quantity, e.price, e.expiry_date
    FROM expired_stock e
    JOIN products p ON p.id=e.product_id
    ORDER BY e.expired_at DESC
  `);

  return Response.json(rows);
}
