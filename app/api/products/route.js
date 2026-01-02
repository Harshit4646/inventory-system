import { getDB } from "@/db/connection";

export async function GET() {
  const db = getDB();
  const [rows] = await db.query("SELECT * FROM products ORDER BY name");
  return Response.json(rows);
}

export async function POST(req) {
  const { name } = await req.json();
  if (!name) return Response.json({ error: "Name required" }, { status: 400 });

  const db = getDB();
  await db.query("INSERT IGNORE INTO products (name) VALUES (?)", [name]);

  return Response.json({ success: true });
}
