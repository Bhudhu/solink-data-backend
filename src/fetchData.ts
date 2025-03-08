import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SOLCAST_API_URL = process.env.SOLCAST_API_URL;

if (!SOLCAST_API_URL) {
  console.error("❌ ERROR: SOLCAST_API_URL is not defined. Check your .env file.");
  process.exit(1);
}

export const fetchSolcastData = async () => {
  try {
    console.log("🔄 Fetching data from Solcast...");
    const response = await axios.get(SOLCAST_API_URL);
    console.log("✅ Data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return null;
  }
};
