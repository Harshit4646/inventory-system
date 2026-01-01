import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM expired ORDER BY expiry ASC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Move expired items (run daily or via cron)
export async function POST() {
  try {
    const [expiredItems] = await db.query("SELECT * FROM stock WHERE expiry < CURDATE() AND quantity > 0");

    for (let item of expiredItems) {
      // Insert into expired
      await db.query(
        "INSERT INTO expired (name, qty, expiry) VALUES (?,?,?)",
        [item.name, item.quantity, item.expiry]
      );

      // Delete from stock
      await db.query("UPDATE stock SET quantity = 0 WHERE id = ?", [item.id]);
    }

    return new Response(JSON.stringify({ success: true, moved: expiredItems.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
