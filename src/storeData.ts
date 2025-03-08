import { query } from "./db";
import { fetchSolcastData } from "./fetchData";

// ✅ Function to Store Weather Data
export const storeData = async () => {
  console.log("🔄 Fetching data from Solcast...");
  const fetchedData = await fetchSolcastData();

  if (!fetchedData || !fetchedData.data || !Array.isArray(fetchedData.data)) {
    console.error("❌ No valid data received.");
    return;
  }

  try {
    console.log(`✅ Received ${fetchedData.data.length} entries.`);
    await query("BEGIN");

    for (const item of fetchedData.data) {
      const { period_end, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop } = item;
      await query(
        `INSERT INTO weather_data (timestamp, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [new Date(period_end), air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop]
      );
    }

    await query("COMMIT");
    console.log("✅ Data stored successfully.");
  } catch (error) {
    await query("ROLLBACK");
    console.error("❌ Error storing data:", error);
  }
};

// ✅ Retrieve stored weather data
export const getStoredData = async () => {
  try {
    console.log("🔍 Fetching stored weather data...");
    const result = await query("SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 20;");
    return result.rows;
  } catch (error) {
    console.error("❌ Error fetching stored data:", error);
    throw error;
  }
};

