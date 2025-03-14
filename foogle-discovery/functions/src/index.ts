import { onRequest } from "firebase-functions/v2/https";
import db,{admin} from "./FireBase/FireBase";
import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import {verifyToken} from "./middleware/TokenVerify";
import auth_router from "./routers/Auth";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const MEALDB_API = "https://www.themealdb.com/api/json/v1/1";

app.get("/", (req, res) => {
    return res.send("Welcome to server");
});

app.use('/auth', auth_router);

// Fetch meals from TheMealDB API
app.get("/meals/search/:query", async (req: Request, res: Response) => {
    try {
        const query = req.params.query;
        const response = await axios.get(`${MEALDB_API}/search.php?s=${query}`);
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch meals" });
    }
});

// Save a favorite meal (Authenticated)
app.post("/favorites", verifyToken, async (req: Request, res: Response) => {
    try {
        const { mealId, mealName, mealThumb } = req.body;
        const userId = (req as any).user.uid;

        await db.collection("users").doc(userId).collection("favorites").doc(mealId).set({
            mealId, mealName, mealThumb, savedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: "Meal saved successfully!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get user’s saved meals (Authenticated)
app.get("/favorites", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const snapshot = await db.collection("users").doc(userId).collection("favorites").get();

        const favorites = snapshot.docs.map(doc => doc.data());
        res.json(favorites);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Remove meal from favorites (Authenticated)
app.delete("/favorites/:mealId", verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const mealId = req.params.mealId;

        await db.collection("users").doc(userId).collection("favorites").doc(mealId).delete();

        res.json({ message: "Meal removed successfully!" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Export Firebase Cloud Function
exports.api = onRequest(app);