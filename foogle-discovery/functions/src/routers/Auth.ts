import { Router, Request, Response } from "express";
import { auth } from "../FireBase/FireBase";
import axios from "axios";

const auth_router = Router();

// Register a new user
auth_router.post("/register", async (req: Request, res: Response) => {
    const { email, password, user_name } = req.body;

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: user_name
        });

        const token = await auth.createCustomToken(userRecord.uid);

        res.status(201).json({ 
            message: "User registered successfully", 
            user: userRecord, 
            token 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Sign in a user
auth_router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Use Firebase Authentication REST API to verify email and password
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        });

        const { idToken, localId } = response.data;
        const user = await auth.getUser(localId);
        const token = await auth.createCustomToken(localId);

        res.status(200).json({ 
            message: "User signed in successfully", 
            user, 
            token, 
            idToken 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.response.data.error.message });
    }
});

export default auth_router;