"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredData = exports.storeData = void 0;
const db_1 = require("./db");
const fetchData_1 = require("./fetchData");
// ✅ Function to Store Weather Data
const storeData = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔄 Fetching data from Solcast...");
    const fetchedData = yield (0, fetchData_1.fetchSolcastData)();
    if (!fetchedData || !fetchedData.data || !Array.isArray(fetchedData.data)) {
        console.error("❌ No valid data received.");
        return;
    }
    try {
        console.log(`✅ Received ${fetchedData.data.length} entries.`);
        yield (0, db_1.query)("BEGIN");
        for (const item of fetchedData.data) {
            const { period_end, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop } = item;
            yield (0, db_1.query)(`INSERT INTO weather_data (timestamp, air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [new Date(period_end), air_temp, dni, ghi, relative_humidity, surface_pressure, wind_speed_10m, pv_power_rooftop]);
        }
        yield (0, db_1.query)("COMMIT");
        console.log("✅ Data stored successfully.");
    }
    catch (error) {
        yield (0, db_1.query)("ROLLBACK");
        console.error("❌ Error storing data:", error);
    }
});
exports.storeData = storeData;
//Retrieve stored weather data
const getStoredData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔍 Fetching stored weather data...");
        const result = yield (0, db_1.query)("SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 20;");
        return result.rows;
    }
    catch (error) {
        console.error("❌ Error fetching stored data:", error);
        throw error;
    }
});
exports.getStoredData = getStoredData;
