import { getDB } from "@/db/connection";

export async function DELETE(_, { params }) {
  const db = getDB();
  const saleId = params.id;

  const [items] = await db.query(
    "SELECT * FROM sale_items WHERE sale_id=?",
    [saleId]
  );

  for (const i of items) {
    await db.query(
      "UPDATE stock SET quantity = quantity + ? WHERE id=?",
      [i.quantity, i.stock_id]
    );
  }

  await db.query("DELETE FROM sale_items WHERE sale_id=?", [saleId]);
  await db.query("DELETE FROM sales WHERE id=?", [saleId]);

  return Response.json({ success: true });
}
