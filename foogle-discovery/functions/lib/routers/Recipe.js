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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FireBase_1 = __importStar(require("../FireBase/FireBase"));
const TokenVerify_1 = require("../middleware/TokenVerify");
const UploadManager_1 = require("../middleware/UploadManager");
const GenerateID_1 = require("../tools/GenerateID");
const recipe_router = (0, express_1.Router)();
// Create a new recipe
recipe_router.post("/", TokenVerify_1.verifyToken, UploadManager_1.uploadManager, UploadManager_1.checkValidImgMiddleware, UploadManager_1.checkValidJsonMiddleware, async (req, res) => {
    var _a;
    const { title, ingredients, area, instruction, category } = req.body;
    const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    const userId = req.user.uid;
    try {
        // Generate a unique ID for the image
        const imgId = (0, GenerateID_1.generateID)();
        // Upload the image to Firebase Storage
        const bucket = FireBase_1.storage.bucket();
        const file = bucket.file(`images/${imgId}`);
        await file.save(img.data, {
            metadata: { contentType: img.mimetype },
            public: true,
        });
        // Get the public URL of the uploaded image
        const imgUrl = `https://storage.googleapis.com/${bucket.name}/images/${imgId}`;
        // Create a new recipe
        const newRecipe = {
            title,
            img_id: imgId,
            img_url: imgUrl,
            ingredients,
            area,
            instruction,
            category,
            user_id: userId,
            created_at: FireBase_1.admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await FireBase_1.default.collection("Recipe").add(newRecipe);
        res.status(201).json({ message: "Recipe created successfully", id: docRef.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update a recipe
recipe_router.put("/:id", TokenVerify_1.verifyToken, UploadManager_1.uploadManager, (...params) => (0, UploadManager_1.checkValidImgMiddleware)(...params, false), UploadManager_1.checkValidJsonMiddleware, async (req, res) => {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const { title, ingredients, area, instruction, category } = req.body;
    const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    const userId = req.user.uid;
    try {
        const recipeRef = FireBase_1.default.collection("Recipe").doc(id);
        const recipeDoc = await recipeRef.get();
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        if (((_b = recipeDoc.data()) === null || _b === void 0 ? void 0 : _b.user_id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        let imgId = (_c = recipeDoc.data()) === null || _c === void 0 ? void 0 : _c.img_id;
        let imgUrl = (_d = recipeDoc.data()) === null || _d === void 0 ? void 0 : _d.img_url;
        // If a new image is provided, upload it to Firebase Storage
        if (img) {
            // Generate a unique ID for the new image
            imgId = (0, GenerateID_1.generateID)();
            // Upload the new image to Firebase Storage
            const bucket = FireBase_1.storage.bucket();
            const file = bucket.file(`images/${imgId}`);
            await file.save(img.data, {
                metadata: { contentType: img.mimetype },
                public: true,
            });
            // Get the public URL of the uploaded image
            imgUrl = `https://storage.googleapis.com/${bucket.name}/images/${imgId}`;
        }
        await recipeRef.update({
            title,
            img_id: imgId,
            img_url: imgUrl,
            ingredients,
            area,
            instruction,
            category,
            updated_at: FireBase_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.status(200).json({ message: "Recipe updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Delete a recipe
recipe_router.delete("/:id", TokenVerify_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = req.user.uid;
    try {
        const recipeRef = FireBase_1.default.collection("Recipe").doc(id);
        const recipeDoc = await recipeRef.get();
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        if (((_a = recipeDoc.data()) === null || _a === void 0 ? void 0 : _a.user_id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await recipeRef.delete();
        res.status(200).json({ message: "Recipe deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get recipes by combined criteria
recipe_router.get("/search", async (req, res) => {
    const { name, category, area } = req.query;
    try {
        let query = FireBase_1.default.collection("Recipe");
        if (name) {
            query = query.where("title", "==", name);
        }
        if (category) {
            query = query.where("category", "==", category);
        }
        if (area) {
            query = query.where("area", "==", area);
        }
        const snapshot = await query.get();
        const recipes = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(recipes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get recipes by id
recipe_router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const recipeDoc = await FireBase_1.default.collection("Recipe").doc(id).get();
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.status(200).json(Object.assign({ id: recipeDoc.id }, recipeDoc.data()));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
exports.default = recipe_router;
//# sourceMappingURL=Recipe.js.map