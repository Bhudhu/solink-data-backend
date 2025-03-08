import { query } from "./db";

const testDbConnection = async () => {
  try {
    console.log("🔄 Connecting to the database...");
    const result = await query("SELECT NOW();"); // Get current timestamp
    console.log("✅ Database Connected! Current Time:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

testDbConnection();

