import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM stock ORDER BY name ASC, expiry ASC");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, price, quantity, expiry } = await req.json();

    // Insert new stock entry
    await db.query(
      "INSERT INTO stock (name, price, quantity, expiry) VALUES (?,?,?,?)",
      [name, price, quantity, expiry]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
