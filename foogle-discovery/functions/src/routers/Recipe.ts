import { Router, Request, Response } from "express";
import db, { admin, storage } from "../FireBase/FireBase";
import { verifyToken } from "../middleware/TokenVerify";
import { checkValidImgMiddleware, checkValidJsonMiddleware, uploadManager } from "../middleware/UploadManager";
import { UploadedFile } from "express-fileupload";
import { generateID } from "../tools/GenerateID";

const recipe_router = Router();

// Create a new recipe
recipe_router.post("/", verifyToken, uploadManager, checkValidImgMiddleware, checkValidJsonMiddleware, async (req: Request, res: Response) => {
    const { title, ingredients, area, instruction, category } = req.body;
    const img = req.files?.image as UploadedFile;
    const userId = (req as any).user.uid;

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
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("Recipe").add(newRecipe);
        res.status(201).json({ message: "Recipe created successfully", id: docRef.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a recipe
recipe_router.put("/:id", verifyToken, uploadManager, (...params)=>checkValidImgMiddleware(...params,false), checkValidJsonMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, ingredients, area, instruction, category } = req.body;
    const img = req.files?.image as UploadedFile;
    const userId = (req as any).user.uid;

    try {
        const recipeRef = db.collection("Recipe").doc(id);
        const recipeDoc = await recipeRef.get();

        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (recipeDoc.data()?.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        let imgId = recipeDoc.data()?.img_id;
        let imgUrl = recipeDoc.data()?.img_url;

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

        await recipeRef.update({
            title,
            img_id: imgId,
            img_url: imgUrl,
            ingredients,
            area,
            instruction,
            category,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(200).json({ message: "Recipe updated successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Delete a recipe
recipe_router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.uid;

    try {
        const recipeRef = db.collection("Recipe").doc(id);
        const recipeDoc = await recipeRef.get();

        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (recipeDoc.data()?.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await recipeRef.delete();
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get recipes by combined criteria
recipe_router.get("/search", async (req: Request, res: Response) => {
    const { name, category, area } = req.query;

    try {
        let query = db.collection("Recipe") as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

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
        const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(recipes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get recipes by id
recipe_router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const recipeDoc = await db.collection("Recipe").doc(id).get();

        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.status(200).json({ id: recipeDoc.id, ...recipeDoc.data() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

export default recipe_router;