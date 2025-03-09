import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getStoredData, storeData } from "./storeData";
import scheduleCronJob from "./cronJob";

dotenv.config();

const app: Application = express(); // ✅ Explicitly type `app` as an Express Application
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: ["http://localhost:5173", "https://your-deployed-frontend-url.com"],
  methods: ["GET"],
}));

// ✅ Root Route
app.get("/", (_req: Request, res: Response) => { // ✅ `_req` indicates unused variable
  res.send("🌤️ SOLINK Weather API is running!");
});

// ✅ Fetch stored weather data
app.get("/fetch", async (_req: Request, res: Response): Promise<void> => { 
  try {
    console.log("🔍 Fetching stored weather data...");
    const data = await getStoredData();

    if (!data || data.length === 0) {
      console.warn("⚠️ No data found in database.");
      res.status(404).json({ error: "No data found" });
      return;
    }

    console.log(`✅ Returning ${data.length} stored records.`);
    res.json({ data });
  } catch (error) {
    console.error("❌ Error fetching stored data:", error);
    res.status(500).json({ error: "Error fetching stored data" });
  }
});

// ✅ Endpoint to manually fetch and store new weather data from Solcast API
app.get("/update", async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔄 Fetching and storing new weather data...");
    await storeData();

    const newData = await getStoredData();
    console.log(`✅ Successfully stored ${newData.length} new records.`);
    
    res.json({ message: "New weather data fetched and stored successfully.", data: newData });
  } catch (error) {
    console.error("❌ Error updating weather data:", error);
    res.status(500).json({ error: "Error updating weather data" });
  }
});

// ✅ Start the cron job
scheduleCronJob(); 

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
