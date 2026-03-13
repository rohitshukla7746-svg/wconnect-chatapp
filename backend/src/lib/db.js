import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Prevent unhandled error events from crashing the process
pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err.message);
});

pool.connect()
  .then(() => console.log("✅ DB connected successfully"))
  .catch((err) => console.error("❌ DB not connected", err));

export default pool;
