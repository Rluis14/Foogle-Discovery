import express from "express"
import { verifyToken } from "../middleware/TokenVerify";
import db, { admin } from "../FireBase/FireBase";
const user_router = express.Router();
user_router.post("recipe/favorites/:id",verifyToken,async(req,res)=>{
    try{
        const userId = (req as any).user.uid;
        const userRef = db.collection("User").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userDoc.data()?.id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const {id} = req.body;

        // Add recipe_id to the user's favorites array
        await userRef.update({
            saved_recipe_ids: admin.firestore.FieldValue.arrayUnion(id),
        });

        res.status(200).json({ message: "Recipe added to favorites" });
        
    }catch(err){
        res.status(500).json({error:"Unexpected error"});
    }
    return;
})

// Add delete route to remove recipe_id from favorites array
user_router.delete("/favorites/:id", verifyToken, async (req: any, res) => {
    try {
        const userId = (req as any).user.uid;
        const userRef = db.collection("User").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userDoc.data()?.id !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const { id } = req.params;

        // Remove recipe_id from the user's favorites array
        await userRef.update({
            saved_recipe_ids: admin.firestore.FieldValue.arrayRemove(id),
        });

        res.status(200).json({ message: "Recipe removed from favorites" });

    } catch (err) {
        res.status(500).json({ error: "Unexpected error" });
    }
    return;
});

export default user_router;