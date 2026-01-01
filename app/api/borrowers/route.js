import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM borrowers ORDER BY name ASC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, paidCash, paidOnline, paidDiscount } = await req.json();

    const paidTotal = (paidCash || 0) + (paidOnline || 0) + (paidDiscount || 0);

    // Reduce borrower balance
    await db.query(
      "UPDATE borrowers SET balance = balance - ? WHERE name = ?",
      [paidTotal, name]
    );

    // Insert into payments table with payment_date = today
    await db.query(
      "INSERT INTO payments (borrower_name, cash, online, discount, payment_date) VALUES (?,?,?,?,CURDATE())",
      [name, paidCash || 0, paidOnline || 0, paidDiscount || 0]
    );

    // Remove fully paid borrowers
    await db.query("DELETE FROM borrowers WHERE balance <= 0");

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
