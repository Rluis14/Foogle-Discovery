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
    const user_name = (req as any).user.user_name;
    // Validate required fields
    if (!title || !ingredients || !area || !instruction || !category || !img) {
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
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("Recipe").add(newRecipe);
        res.status(201).json({ message: "Recipe created successfully", id: docRef.id });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
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
        const data = recipeDoc.data();
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
            const deleteFile = bucket.file(`images/${data?.img_id}`);
            await Promise.all([deleteFile.delete(),file.save(img.data, {
                metadata: { contentType: img.mimetype },
                public: true,
            })]);
            // Get the public URL of the uploaded image
            imgUrl = `https://storage.googleapis.com/${bucket.name}/images/${imgId}`;
        }

        // Prepare the update data
        const updateData: any = {
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (title !== undefined) updateData.title = title;
        if (ingredients !== undefined) updateData.ingredients = ingredients;
        if (area !== undefined) updateData.area = area;
        if (instruction !== undefined) updateData.instruction = instruction;
        if (category !== undefined) updateData.category = category;
        if (imgId !== undefined) updateData.img_id = imgId;
        if (imgUrl !== undefined) updateData.img_url = imgUrl;

        await recipeRef.update(updateData);

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
        const data = recipeDoc.data();
        const bucket = storage.bucket();
        //delete image from storage
        const deleteFile = bucket.file(`images/${data?.img_id}`);
        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (data?.user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await Promise.all([deleteFile.delete(),recipeRef.delete()]);
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
            query = query.where('title', '>=', name).where('title', '<=', name + '~');
        }
        if (category) {
            query = query.where("category", "==", category);
        }
        if (area) {
            query = query.where("area", "==", area);
        }

        const snapshot = await query.get();
        const recipes = snapshot.docs.map(doc => doc.data());
        res.status(200).json(recipes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get list of user favorite recipes
recipe_router.get("/favorites", verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).user.uid;

    try {
        const userDoc = await db.collection("User").doc(userId).get();
        const recipe_ids = userDoc.data()?.saved_recipe_ids || []; 
        const recipesSnapshot = await db.collection("Recipe").where(admin.firestore.FieldPath.documentId(), "in", recipe_ids).get();
        const recipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(),saved:true }));
        res.status(200).json(recipes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get list of user-owned recipes
recipe_router.get("/my_recipes", verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).user.uid;

    try {
        const recipesSnapshot = await db.collection("Recipe").where("user_id", "==", userId).get();
        const recipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(recipes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

// Get recipes by id
recipe_router.get("/:id", (...params)=>verifyToken(...params,false), async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.uid;
    try {
        const recipeDoc = await db.collection("Recipe").doc(id).get();

        if (!recipeDoc.exists) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const recipeData = recipeDoc.data();

        // Fetch reviews for the recipe
        const reviewsSnapshot = await db.collection("Review").where("recipe_id", "==", id).get();
        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        
        // Calculate the average rating
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;
        // Check if the recipe is in the user's favorites
        let saved = false;
        if(userId){
            const userSnapshot = await db.collection("User").doc(userId).get();
            saved = userSnapshot.data()?.saved_recipe_ids.includes(id)||false;
        }

        res.status(200).json({ id: recipeDoc.id, ...recipeData, average_rating: averageRating, reviews, saved });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
    return;
});

export default recipe_router;