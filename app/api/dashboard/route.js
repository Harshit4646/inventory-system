import pool from "../../../../db/connection";

export const dynamic = "force-dynamic";

export async function GET() {
  const [[daily]] = await pool.query(`
    SELECT
      IFNULL(SUM(total_amount),0) total,
      IFNULL(SUM(CASE WHEN sale_type='cash' THEN total_amount END),0) cash,
      IFNULL(SUM(CASE WHEN sale_type='online' THEN total_amount END),0) online
    FROM sales
    WHERE DATE(sale_date)=CURDATE()
  `);

  const [[monthly]] = await pool.query(`
    SELECT
      IFNULL(SUM(total_amount),0) total,
      IFNULL(SUM(CASE WHEN sale_type='cash' THEN total_amount END),0) cash,
      IFNULL(SUM(CASE WHEN sale_type='online' THEN total_amount END),0) online
    FROM sales
    WHERE MONTH(sale_date)=MONTH(CURDATE())
      AND YEAR(sale_date)=YEAR(CURDATE())
  `);

  return Response.json({ daily, monthly });
}
