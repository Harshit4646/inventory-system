import { getDB } from "@/db/connection";

export async function POST(req) {
  const { items, payment_type, borrower_name, sale_date } = await req.json();
  const db = getDB();

  let borrowerId = null;

  if (payment_type === "BORROW") {
    const [b] = await db.query(
      "SELECT id FROM borrowers WHERE name=?",
      [borrower_name]
    );

    borrowerId = b.length
      ? b[0].id
      : (await db.query(
          "INSERT INTO borrowers (name) VALUES (?)",
          [borrower_name]
        ))[0].insertId;
  }

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const [sale] = await db.query(
    "INSERT INTO sales (sale_date,total_amount,payment_type,borrower_id) VALUES (?,?,?,?)",
    [sale_date, total, payment_type, borrowerId]
  );

  for (const item of items) {
    await db.query(
      "INSERT INTO sale_items (sale_id,stock_id,product_id,quantity,price) VALUES (?,?,?,?,?)",
      [sale.insertId, item.stock_id, item.product_id, item.quantity, item.price]
    );

    await db.query(
      "UPDATE stock SET quantity = quantity - ? WHERE id=?",
      [item.quantity, item.stock_id]
    );
  }

  return Response.json({ success: true });
}
