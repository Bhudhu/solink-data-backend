import cron from "node-cron";
import { storeData } from "./storeData";

const scheduleCronJob = () => {
  console.log("🔄 Cron job initialized. Fetching weather data every 1 hour...");

  cron.schedule("0 * * * *", async () => { // Runs every hour at 00 minutes
    console.log("⏳ Running scheduled task: Fetching weather data...");

    try {
      const success = await storeData();
      if (success) {
        console.log("✅ Data successfully stored.");
      } else {
        console.warn("⚠️ No new data stored. Possible duplicate or API issue.");
      }
    } catch (error) {
      console.error("❌ Error running cron job:", error);
    }
  });
};

//Ensure cron job starts when this file is executed
scheduleCronJob();

export default scheduleCronJob;
