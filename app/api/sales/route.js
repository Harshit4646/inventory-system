import pool from "../../../../db/connection";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { items, type, borrower } = await req.json();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [saleRes] = await conn.query(
      `INSERT INTO sales(total_amount,sale_type,editable_until)
       VALUES(0,?,DATE_ADD(CURDATE(), INTERVAL 7 DAY))`,
      [type]
    );
    const saleId = saleRes.insertId;

    let total = 0;

    for (const i of items) {
      total += i.price * i.qty;

      await conn.query(
        `INSERT INTO sale_items(sale_id,stock_id,quantity,price)
         VALUES(?,?,?,?)`,
        [saleId, i.stock_id, i.qty, i.price]
      );

      await conn.query(
        `UPDATE stock SET quantity=quantity-? WHERE id=?`,
        [i.qty, i.stock_id]
      );
    }

    await conn.query(
      `UPDATE sales SET total_amount=? WHERE id=?`,
      [total, saleId]
    );

    /* Borrow logic */
    if (type === "borrow") {
      let [[b]] = await conn.query(
        "SELECT id FROM borrowers WHERE name=?",
        [borrower]
      );

      let borrowerId;
      if (!b) {
        const [r] = await conn.query(
          "INSERT INTO borrowers(name,total_due) VALUES(?,0)",
          [borrower]
        );
        borrowerId = r.insertId;
      } else borrowerId = b.id;

      await conn.query(
        `INSERT INTO borrower_ledger(borrower_id,sale_id,amount)
         VALUES(?,?,?)`,
        [borrowerId, saleId, total]
      );

      await conn.query(
        `UPDATE borrowers SET total_due=total_due+? WHERE id=?`,
        [total, borrowerId]
      );
    }

    await conn.commit();
    return Response.json({ success: true });
  } catch (e) {
    await conn.rollback();
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
