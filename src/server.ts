import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getStoredData } from "./storeData"; // ✅ Ensure this function exists

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
  res.send("SOLINK Weather API is running!");
});

// ✅ Fetch stored weather data
app.get("/fetch", async (_req: Request, res: Response): Promise<void> => { // ✅ Explicitly type the response
  try {
    const data = await getStoredData();
    if (!data || data.length === 0) {
      res.status(404).json({ error: "No data found" });
      return;
    }
    res.json({ data });
  } catch (error) {
    console.error("❌ Error fetching stored data:", error);
    res.status(500).json({ error: "Error fetching stored data" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
