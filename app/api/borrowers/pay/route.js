import { getDB } from "@/db/connection";

export async function POST(req) {
  const { borrower_id, amount, payment_date } = await req.json();
  const db = getDB();

  await db.query(
    "INSERT INTO borrower_payments (borrower_id,amount,payment_date) VALUES (?,?,?)",
    [borrower_id, amount, payment_date]
  );

  return Response.json({ success: true });
}
