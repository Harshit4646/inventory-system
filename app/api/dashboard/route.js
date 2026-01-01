import { db } from "@/lib/db";

export async function GET() {
  try {
    // Daily totals from sales
    const [dailySales] = await db.query(
      `SELECT 
        SUM(total) as total,
        SUM(CASE WHEN payment_type='cash' THEN total ELSE 0 END) as cash,
        SUM(CASE WHEN payment_type='online' THEN total ELSE 0 END) as online
      FROM sales
      WHERE sale_date = CURDATE()`
    );

    // Daily totals from borrower payments
    const [dailyPayments] = await db.query(
      `SELECT 
        SUM(cash) as cash,
        SUM(online) as online,
        SUM(discount) as discount
      FROM payments
      WHERE payment_date = CURDATE()`
    );

    const dailyTotal = (dailySales[0].total || 0) +
                       ((dailyPayments[0].cash || 0) + (dailyPayments[0].online || 0) + (dailyPayments[0].discount || 0));
    const dailyCash = (dailySales[0].cash || 0) + (dailyPayments[0].cash || 0);
    const dailyOnline = (dailySales[0].online || 0) + (dailyPayments[0].online || 0);

    // Monthly totals from sales
    const [monthlySales] = await db.query(
      `SELECT 
        SUM(total) as total,
        SUM(CASE WHEN payment_type='cash' THEN total ELSE 0 END) as cash,
        SUM(CASE WHEN payment_type='online' THEN total ELSE 0 END) as online
      FROM sales
      WHERE MONTH(sale_date) = MONTH(CURDATE())`
    );

    // Monthly totals from borrower payments
    const [monthlyPayments] = await db.query(
      `SELECT 
        SUM(cash) as cash,
        SUM(online) as online,
        SUM(discount) as discount
      FROM payments
      WHERE MONTH(payment_date) = MONTH(CURDATE())`
    );

    const monthlyTotal = (monthlySales[0].total || 0) +
                         ((monthlyPayments[0].cash || 0) + (monthlyPayments[0].online || 0) + (monthlyPayments[0].discount || 0));
    const monthlyCash = (monthlySales[0].cash || 0) + (monthlyPayments[0].cash || 0);
    const monthlyOnline = (monthlySales[0].online || 0) + (monthlyPayments[0].online || 0);

    return new Response(JSON.stringify({
      daily: { total: dailyTotal, cash: dailyCash, online: dailyOnline },
      monthly: { total: monthlyTotal, cash: monthlyCash, online: monthlyOnline }
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
