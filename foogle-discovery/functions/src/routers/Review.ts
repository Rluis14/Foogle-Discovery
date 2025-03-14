import { Router, Request, Response } from "express";
import db, { admin, storage } from "../FireBase/FireBase";
import { verifyToken } from "../middleware/TokenVerify";
import { checkValidImgMiddleware, checkValidJsonMiddleware, uploadManager } from "../middleware/UploadManager";
import { UploadedFile } from "express-fileupload";
import { generateID } from "../tools/GenerateID";

const review_router = Router();

// Create a new review
review_router.post("/", verifyToken, uploadManager, checkValidImgMiddleware, checkValidJsonMiddleware, async (req: Request, res: Response) => {
    const { title, description, rating, recipe_id } = req.body;
    const img = req.files?.image as UploadedFile;
    const userId = (req as any).user.uid;
    // Validate required fields
    if (!title || !description || !rating || !recipe_id || !img) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // Generate a unique ID for the image
        const imgId = generateID();

        // Upload the image to Firebase Storage
        const bucket = storage.bucket();
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
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("Review").add(newReview);
        res.status(201).json({ message: "Review created successfully", id: docRef.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a review
review_router.put("/:id", verifyToken, uploadManager, (...params)=>checkValidImgMiddleware(...params,false), checkValidJsonMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, rating } = req.body;
    const img = req.files?.image as UploadedFile;
    const userId = (req as any).user.uid;

    try {
        const reviewRef = db.collection("Review").doc(id);
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            return res.status(404).json({ error: "Review not found" });
        }
        const data = reviewDoc.data();
        
        if (data?.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        let imgId = data?.img_id;
        let imgUrl = data?.img_url;

        // If a new image is provided, upload it to Firebase Storage
        if (img) {
            // Generate a unique ID for the new image
            imgId = generateID();

            // Upload the new image to Firebase Storage
            const bucket = storage.bucket();
            const file = bucket.file(`images/${imgId}`);
            await file.save(img.data, {
                metadata: { contentType: img.mimetype },
                public: true,
            });

            // Get the public URL of the uploaded image
            imgUrl = `https://storage.googleapis.com/${bucket.name}/images/${imgId}`;
        }

        // Prepare the update data
        const updateData: any = {
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (rating !== undefined) updateData.rating = rating;
        if (imgId !== undefined) updateData.img_id = imgId;
        if (imgUrl !== undefined) updateData.img_url = imgUrl;

        await reviewRef.update(updateData);

        return res.status(200).json({ message: "Review updated successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a review
review_router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.uid;

    try {
        const reviewRef = db.collection("Review").doc(id);
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (reviewDoc.data()?.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await reviewRef.delete();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get reviews by recipe ID
review_router.get("/recipe/:recipe_id", async (req: Request, res: Response) => {
    const { recipe_id } = req.params;

    try {
        const snapshot = await db.collection("Review").where("recipe_id", "==", recipe_id).get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews by user ID
review_router.get("/user/:user_id", async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const snapshot = await db.collection("Review").where("user_id", "==", user_id).get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default review_router;
