import { getDB } from "@/db/connection";

export async function PUT(req, { params }) {
  const db = getDB();
  const saleId = params.id;
  const { items, total_amount } = await req.json();

  const [[sale]] = await db.query(`
    SELECT sale_date FROM sales WHERE id=?
  `, [saleId]);

  if (!sale || sale.sale_date < new Date(Date.now() - 7*24*60*60*1000)) {
    return Response.json({ error: "Edit window expired" }, { status: 403 });
  }

  // rollback stock
  const [oldItems] = await db.query(
    "SELECT * FROM sale_items WHERE sale_id=?",
    [saleId]
  );

  for (const i of oldItems) {
    await db.query(
      "UPDATE stock SET quantity = quantity + ? WHERE id=?",
      [i.quantity, i.stock_id]
    );
  }

  await db.query("DELETE FROM sale_items WHERE sale_id=?", [saleId]);

  // apply new items
  for (const i of items) {
    await db.query(
      "INSERT INTO sale_items (sale_id,stock_id,product_id,quantity,price) VALUES (?,?,?,?,?)",
      [saleId, i.stock_id, i.product_id, i.quantity, i.price]
    );

    await db.query(
      "UPDATE stock SET quantity = quantity - ? WHERE id=?",
      [i.quantity, i.stock_id]
    );
  }

  await db.query(
    "UPDATE sales SET total_amount=? WHERE id=?",
    [total_amount, saleId]
  );

  return Response.json({ success: true });
}
