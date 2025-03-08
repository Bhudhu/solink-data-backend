import { query } from "./db";
import { fetchSolcastData } from "./fetchData";

// ✅ Function to Store Weather Data
export const storeData = async () => {
  console.log("🔄 Fetching data from Solcast...");

  const fetchedData = await fetchSolcastData();

  if (!fetchedData || !fetchedData.data || !Array.isArray(fetchedData.data)) {
    console.error("❌ No valid data received from Solcast API.");
    return;
  }

  console.log(`✅ Successfully fetched ${fetchedData.data.length} entries from Solcast.`);

  try {
    console.log("📌 Beginning database transaction...");
    await query("BEGIN");

    for (const item of fetchedData.data) {
      console.log("📝 Processing item:", item);

      const { 
        period_end, 
        air_temp, 
        dni, 
        ghi, 
        relative_humidity, 
        surface_pressure, 
        wind_speed_10m, 
        pv_power_rooftop 
      } = item;

      console.log("📌 Inserting into database:", {
        timestamp: new Date(period_end),
        air_temp,
        dni,
        ghi,
        relative_humidity,
        surface_pressure,
        wind_speed_10m,
        pv_power_rooftop
      });

      await query(
        `INSERT INTO weather_data (timestamp, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [new Date(period_end), air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop]
      );

      console.log("✅ Entry inserted successfully.");
    }

    await query("COMMIT");
    console.log("✅ All data stored successfully.");
  } catch (error) {
    await query("ROLLBACK");
    console.error("❌ Error storing data, rolling back transaction:", error);
  }
};

// ✅ Retrieve stored weather data
export const getStoredData = async () => {
  try {
    console.log("🔍 Fetching stored weather data from database...");
    const result = await query("SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 20;");
    
    if (result.rows.length === 0) {
      console.warn("⚠️ No weather data found in database.");
    } else {
      console.log(`✅ Retrieved ${result.rows.length} records from the database.`);
    }

    return result.rows;
  } catch (error) {
    console.error("❌ Error fetching stored data:", error);
    throw error;
  }
};
