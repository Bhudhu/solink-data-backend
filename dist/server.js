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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const storeData_1 = require("./storeData"); // ✅ Ensure this function exists
dotenv_1.default.config();
const app = (0, express_1.default)(); // ✅ Explicitly type `app` as an Express Application
const PORT = process.env.PORT || 5000;
// ✅ Enable CORS for frontend requests
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://your-deployed-frontend-url.com"],
    methods: ["GET"],
}));
// ✅ Root Route
app.get("/", (_req, res) => {
    res.send("SOLINK Weather API is running!");
});
// ✅ Fetch stored weather data
app.get("/fetch", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, storeData_1.getStoredData)();
        if (!data || data.length === 0) {
            res.status(404).json({ error: "No data found" });
            return;
        }
        res.json({ data });
    }
    catch (error) {
        console.error("❌ Error fetching stored data:", error);
        res.status(500).json({ error: "Error fetching stored data" });
    }
}));
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
