import mysql from "mysql2/promise";

// Create a connection pool
export const db = mysql.createPool({
  host: process.env.DB_HOST,      // e.g., "localhost" or Vercel MySQL host
  user: process.env.DB_USER,      // DB username
  password: process.env.DB_PASS,  // DB password
  database: process.env.DB_NAME,  // DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
