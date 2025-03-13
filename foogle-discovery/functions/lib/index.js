"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
const db = admin.firestore();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
const MEALDB_API = "https://www.themealdb.com/api/json/v1/1";
// Middleware to verify Firebase Authentication token
const verifyAuth = async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};
// Fetch meals from TheMealDB API
app.get("/meals/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const response = await axios_1.default.get(`${MEALDB_API}/search.php?s=${query}`);
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch meals" });
    }
});
// Save a favorite meal (Authenticated)
app.post("/favorites", verifyAuth, async (req, res) => {
    try {
        const { mealId, mealName, mealThumb } = req.body;
        const userId = req.user.uid;
        await db.collection("users").doc(userId).collection("favorites").doc(mealId).set({
            mealId, mealName, mealThumb, savedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ message: "Meal saved successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get user’s saved meals (Authenticated)
app.get("/favorites", verifyAuth, async (req, res) => {
    try {
        const userId = req.user.uid;
        const snapshot = await db.collection("users").doc(userId).collection("favorites").get();
        const favorites = snapshot.docs.map(doc => doc.data());
        res.json(favorites);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Remove meal from favorites (Authenticated)
app.delete("/favorites/:mealId", verifyAuth, async (req, res) => {
    try {
        const userId = req.user.uid;
        const mealId = req.params.mealId;
        await db.collection("users").doc(userId).collection("favorites").doc(mealId).delete();
        res.json({ message: "Meal removed successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Export Firebase Cloud Function
exports.api = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map