import pool from "../../../../db/connection";

export const dynamic = "force-dynamic";

/* Show expired */
export async function GET() {
  const [rows] = await pool.query(`
    SELECT e.*, p.name
    FROM expired_stock e
    JOIN products p ON p.id = e.product_id
    ORDER BY moved_at DESC
  `);
  return Response.json(rows);
}

/* Move expired */
export async function POST() {
  const [expired] = await pool.query(`
    SELECT * FROM stock WHERE expiry_date < CURDATE()
  `);

  for (const item of expired) {
    await pool.query(
      `INSERT INTO expired_stock
       (stock_id,product_id,price,quantity,expiry_date)
       VALUES(?,?,?,?,?)`,
      [item.id, item.product_id, item.price, item.quantity, item.expiry_date]
    );
    await pool.query(`DELETE FROM stock WHERE id=?`, [item.id]);
  }

  return Response.json({ moved: expired.length });
}
