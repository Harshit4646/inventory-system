import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { items, paymentType, borrowerName } = await req.json();

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), { status: 400 });
    }

    // Calculate total sale
    const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

    // Insert into sales table
    const [saleResult] = await db.query(
      "INSERT INTO sales (payment_type, borrower_name, total) VALUES (?,?,?)",
      [paymentType, borrowerName || null, total]
    );

    const saleId = saleResult.insertId;

    // Insert into sale_items and reduce stock quantity
    for (let i of items) {
      // Insert sale item
      await db.query(
        "INSERT INTO sale_items (sale_id, stock_id, qty, price) VALUES (?,?,?,?)",
        [saleId, i.stockId, i.qty, i.price]
      );

      // Update stock
      await db.query(
        "UPDATE stock SET quantity = quantity - ? WHERE id = ?",
        [i.qty, i.stockId]
      );

      // If borrow, save to borrow_history
      if (paymentType === "borrow") {
        const [[stockRow]] = await db.query("SELECT name FROM stock WHERE id = ?", [i.stockId]);
        await db.query(
          "INSERT INTO borrow_history (borrower_name, item_name, qty, price, sale_date) VALUES (?,?,?,?,CURDATE())",
          [borrowerName, stockRow.name, i.qty, i.price]
        );
      }
    }

    // If payment is borrow, update borrower table
    if (paymentType === "borrow") {
      await db.query(
        "INSERT INTO borrowers (name,balance) VALUES (?,?) ON DUPLICATE KEY UPDATE balance = balance + ?",
        [borrowerName, total, total]
      );
    }

    return new Response(JSON.stringify({ success: true, saleId }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
