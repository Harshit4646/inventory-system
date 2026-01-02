import { getDB } from "@/db/connection";

export async function POST(req) {
  const { items, payment_type, borrower_name, sale_date } = await req.json();
  const db = getDB();

  let borrowerId = null;

  if (payment_type === "BORROW") {
    const [existing] = await db.query(
      "SELECT id FROM borrowers WHERE name=?",
      [borrower_name]
    );

    if (existing.length) {
      borrowerId = existing[0].id;
    } else {
      const [res] = await db.query(
        "INSERT INTO borrowers (name) VALUES (?)",
        [borrower_name]
      );
      borrowerId = res.insertId;
    }
  }

  let total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [saleRes] = await db.query(
    "INSERT INTO sales (sale_date,total_amount,payment_type,borrower_id) VALUES (?,?,?,?)",
    [sale_date, total, payment_type, borrowerId]
  );

  for (const item of items) {
    await db.query(
      "INSERT INTO sale_items (sale_id,product_id,quantity,price) VALUES (?,?,?,?)",
      [saleRes.insertId, item.product_id, item.quantity, item.price]
    );

    await db.query(
      "UPDATE stock SET quantity = quantity - ? WHERE id=?",
      [item.quantity, item.stock_id]
    );
  }

  return Response.json({ success: true });
}
