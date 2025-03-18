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
    const user_name = req.user.user_name;
    // Validate required fields
    if (!title || !ingredients || !area || !instruction || !category || !img) {
        return res.status(400).json({ error: "All fields are required" });
    }
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
            user_name,
            created_at: FireBase_1.admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await FireBase_1.default.collection("Recipe").add(newRecipe);
        res.status(201).json({ message: "Recipe created successfully", id: docRef.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Update a recipe
recipe_router.put("/:id", TokenVerify_1.verifyToken, UploadManager_1.uploadManager, (...params) => (0, UploadManager_1.checkValidImgMiddleware)(...params, false), UploadManager_1.checkValidJsonMiddleware, async (req, res) => {
    var _a;
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
        const data = recipeDoc.data();
        if ((data === null || data === void 0 ? void 0 : data.user_id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        let imgId = data === null || data === void 0 ? void 0 : data.img_id;
        let imgUrl = data === null || data === void 0 ? void 0 : data.img_url;
        // If a new image is provided, upload it to Firebase Storage
        if (img) {
            // Generate a unique ID for the new image
            imgId = (0, GenerateID_1.generateID)();
            // Upload the new image to Firebase Storage
            const bucket = FireBase_1.storage.bucket();
            const file = bucket.file(`images/${imgId}`);
            const deleteFile = bucket.file(`images/${data === null || data === void 0 ? void 0 : data.img_id}`);
            await Promise.all([deleteFile.delete(), file.save(img.data, {
                    metadata: { contentType: img.mimetype },
                    public: true,
                })]);
            // Get the public URL of the uploaded image
            imgUrl = `https://storage.googleapis.com/${bucket.name}/images/${imgId}`;
        }
        // Prepare the update data
        const updateData = {
            updated_at: FireBase_1.admin.firestore.FieldValue.serverTimestamp(),
        };
        if (title !== undefined)
            updateData.title = title;
        if (ingredients !== undefined)
            updateData.ingredients = ingredients;
        if (area !== undefined)
            updateData.area = area;
        if (instruction !== undefined)
            updateData.instruction = instruction;
        if (category !== undefined)
            updateData.category = category;
        if (imgId !== undefined)
            updateData.img_id = imgId;
        if (imgUrl !== undefined)
            updateData.img_url = imgUrl;
        await recipeRef.update(updateData);
        return res.status(200).json({ message: "Recipe updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Delete a recipe
recipe_router.delete("/:id", TokenVerify_1.verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.uid;
    try {
        const recipeRef = FireBase_1.default.collection("Recipe").doc(id);
        const recipeDoc = await recipeRef.get();
        const data = recipeDoc.data();
        const bucket = FireBase_1.storage.bucket();
        //delete image from storage
        const deleteFile = bucket.file(`images/${data === null || data === void 0 ? void 0 : data.img_id}`);
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        if ((data === null || data === void 0 ? void 0 : data.user_id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await Promise.all([deleteFile.delete(), recipeRef.delete()]);
        res.status(200).json({ message: "Recipe deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Function to calculate average rating based on recipe_id
async function calculateAverageRating(recipeId) {
    const reviewsSnapshot = await FireBase_1.default.collection("Review").where("recipe_id", "==", recipeId).get();
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    return averageRating;
}
// Get recipes by combined criteria
recipe_router.get("/search", async (req, res) => {
    const { name, category, area } = req.query;
    try {
        let query = FireBase_1.default.collection("Recipe");
        if (name) {
            query = query.where('title', '>=', name).where('title', '<=', name + '~');
        }
        if (category) {
            query = query.where("category", "==", category);
        }
        if (area) {
            query = query.where("area", "==", area);
        }
        const snapshot = await query.get();
        const recipes = await Promise.all(snapshot.docs.map(async (doc) => {
            const recipeData = doc.data();
            const averageRating = await calculateAverageRating(doc.id);
            return Object.assign(Object.assign({ id: doc.id }, recipeData), { average_rating: averageRating });
        }));
        res.status(200).json(recipes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get list of user favorite recipes
recipe_router.get("/favorites", TokenVerify_1.verifyToken, async (req, res) => {
    var _a;
    const userId = req.user.uid;
    try {
        const userDoc = await FireBase_1.default.collection("User").doc(userId).get();
        const recipe_ids = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.saved_recipe_ids) || [];
        const recipesSnapshot = await FireBase_1.default.collection("Recipe").where(FireBase_1.admin.firestore.FieldPath.documentId(), "in", recipe_ids).get();
        const recipes = await Promise.all(recipesSnapshot.docs.map(async (doc) => {
            const recipeData = doc.data();
            const averageRating = await calculateAverageRating(doc.id);
            return Object.assign(Object.assign({ id: doc.id }, recipeData), { average_rating: averageRating, saved: true });
        }));
        res.status(200).json(recipes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get list of user-owned recipes
recipe_router.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    const userId = id;
    try {
        const recipesSnapshot = await FireBase_1.default.collection("Recipe").where("user_id", "==", userId).get();
        const recipes = await Promise.all(recipesSnapshot.docs.map(async (doc) => {
            const recipeData = doc.data();
            const averageRating = await calculateAverageRating(doc.id);
            return Object.assign(Object.assign({ id: doc.id }, recipeData), { average_rating: averageRating });
        }));
        res.status(200).json(recipes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get recipes by id
recipe_router.get("/:id", (...params) => (0, TokenVerify_1.verifyToken)(...params, false), async (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
    try {
        const recipeDoc = await FireBase_1.default.collection("Recipe").doc(id).get();
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        const recipeData = recipeDoc.data();
        const averageRating = await calculateAverageRating(id);
        // Check if the recipe is in the user's favorites
        let saved = false;
        if (userId) {
            const userSnapshot = await FireBase_1.default.collection("User").doc(userId).get();
            saved = ((_b = userSnapshot.data()) === null || _b === void 0 ? void 0 : _b.saved_recipe_ids.includes(id)) || false;
        }
        res.status(200).json(Object.assign(Object.assign({ id: recipeDoc.id }, recipeData), { average_rating: averageRating, saved }));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
exports.default = recipe_router;
//# sourceMappingURL=Recipe.js.map