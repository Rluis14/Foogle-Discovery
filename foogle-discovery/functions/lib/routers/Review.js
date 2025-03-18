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
const review_router = (0, express_1.Router)();
// Create a new review
review_router.post("/", TokenVerify_1.verifyToken, UploadManager_1.uploadManager, UploadManager_1.checkValidImgMiddleware, UploadManager_1.checkValidJsonMiddleware, async (req, res) => {
    var _a;
    const { title, description, rating, recipe_id } = req.body;
    const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    const userId = req.user.uid;
    const userName = req.user.user_name;
    // Validate required fields
    if (!title || !description || !rating || !recipe_id || !img) {
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
        // Create a new review
        const newReview = {
            title,
            description,
            rating,
            img_id: imgId,
            img_url: imgUrl,
            recipe_id,
            user_id: userId,
            user_name: userName,
            created_at: FireBase_1.admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await FireBase_1.default.collection("Review").add(newReview);
        res.status(201).json({ message: "Review created successfully", id: docRef.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Update a review
review_router.put("/:id", TokenVerify_1.verifyToken, UploadManager_1.uploadManager, (...params) => (0, UploadManager_1.checkValidImgMiddleware)(...params, false), UploadManager_1.checkValidJsonMiddleware, async (req, res) => {
    var _a;
    const { id } = req.params;
    const { title, description, rating } = req.body;
    const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    const userId = req.user.uid;
    try {
        const reviewRef = FireBase_1.default.collection("Review").doc(id);
        const reviewDoc = await reviewRef.get();
        if (!reviewDoc.exists) {
            return res.status(404).json({ error: "Review not found" });
        }
        const data = reviewDoc.data();
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
            const fileDelete = bucket.file(`images/${data === null || data === void 0 ? void 0 : data.img_id}`);
            await Promise.all([fileDelete.delete(), file.save(img.data, {
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
        if (description !== undefined)
            updateData.description = description;
        if (rating !== undefined)
            updateData.rating = rating;
        if (imgId !== undefined)
            updateData.img_id = imgId;
        if (imgUrl !== undefined)
            updateData.img_url = imgUrl;
        await reviewRef.update(updateData);
        return res.status(200).json({ message: "Review updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Delete a review
review_router.delete("/:id", TokenVerify_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = req.user.uid;
    try {
        const reviewRef = FireBase_1.default.collection("Review").doc(id);
        const reviewDoc = await reviewRef.get();
        //delete image from storage
        const data = reviewDoc.data();
        const bucket = FireBase_1.storage.bucket();
        const fileDelete = bucket.file(`images/${data === null || data === void 0 ? void 0 : data.img_id}`);
        if (!reviewDoc.exists) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (((_a = reviewDoc.data()) === null || _a === void 0 ? void 0 : _a.user_id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await Promise.all([reviewRef.delete(), fileDelete.delete()]);
        res.status(200).json({ message: "Review deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    return;
});
// Get reviews by recipe ID
review_router.get("/recipe/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const snapshot = await FireBase_1.default.collection("Review").where("recipe_id", "==", id).get();
        const reviews = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get reviews by user ID
review_router.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const snapshot = await FireBase_1.default.collection("Review").where("user_id", "==", id).get();
        const reviews = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = review_router;
//# sourceMappingURL=Review.js.map