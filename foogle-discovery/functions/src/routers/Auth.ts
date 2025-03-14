import { Router, Request, Response } from "express";
import { auth } from "../FireBase/FireBase";
import axios from "axios";

const auth_router = Router();

// Register a new user
auth_router.post("/sign_up", async (req: Request, res: Response) => {
    const { email, password, user_name } = req.body;

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: user_name
        });

        const token = await auth.createCustomToken(userRecord.uid, { user_name });

        res.status(201).json({ 
            message: "User registered successfully", 
            user: userRecord, 
            token 
        });
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            res.status(400).json({ error: "Email already exists" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Sign in a user
auth_router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Use Firebase Authentication REST API to verify email and password
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAtW7fszphx2QunGFf6hqdYs1V8P_j5cK8`, {
            email,
            password,
            returnSecureToken: true
        });

        const { idToken, localId } = response.data;
        const user = await auth.getUser(localId);
        const token = await auth.createCustomToken(localId, { user_name: user.displayName });

        res.status(200).json({ 
            message: "User signed in successfully", 
            user, 
            token, 
            idToken 
        });
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            if (errorMessage === "EMAIL_NOT_FOUND" || errorMessage === "INVALID_PASSWORD") {
                res.status(401).json({ error: "Invalid email or password" });
            } else {
                res.status(500).json({ error: errorMessage });
            }
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

export default auth_router;