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
exports.fetchSolcastData = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SOLCAST_API_URL = process.env.SOLCAST_API_URL;
if (!SOLCAST_API_URL) {
    console.error("❌ ERROR: SOLCAST_API_URL is not defined. Check your .env file.");
    process.exit(1);
}
const fetchSolcastData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔄 Fetching data from Solcast...");
        const response = yield axios_1.default.get(SOLCAST_API_URL);
        console.log("✅ Data fetched successfully:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
});
exports.fetchSolcastData = fetchSolcastData;
