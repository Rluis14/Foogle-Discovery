"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FireBase_1 = require("../FireBase/FireBase");
// import axios from "axios";
// import { defineString } from "firebase-functions/params";
// import { defineSecret } from "firebase-functions/params";
const auth_router = (0, express_1.Router)();
// const api_key = defineString("FIREBASE_API_KEY");
// Register a new user
auth_router.post("/sign_up", async (req, res) => {
    const { email, password, user_name } = req.body;
    try {
        const userRecord = await FireBase_1.auth.createUser({
            email,
            password,
            displayName: user_name
        });
        const token = await FireBase_1.auth.createCustomToken(userRecord.uid, { user_name });
        res.status(201).json({
            message: "User registered successfully",
            user: userRecord,
            token
        });
    }
    catch (error) {
        if (error.code === 'auth/email-already-exists') {
            res.status(400).json({ error: "Email already exists" });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
});
// Sign in a user
//can't check password yet
auth_router.post("/login", async (req, res) => {
    const { email } = req.body;
    // const { email, password } = req.body;
    try {
        // Use Firebase Authentication REST API to verify email and password
        // const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`, {
        //     email,
        //     password,
        //     returnSecureToken: true
        // });
        // const { idToken, localId } = response.data;
        const user = await FireBase_1.auth.getUserByEmail(email);
        const token = await FireBase_1.auth.createCustomToken(user.uid, { user_name: user.displayName });
        res.status(200).json({
            message: "User signed in successfully",
            user,
            token,
        });
    }
    catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            if (errorMessage === "EMAIL_NOT_FOUND" || errorMessage === "INVALID_PASSWORD") {
                res.status(401).json({ error: "Invalid email or password" });
            }
            else {
                res.status(500).json({ error: errorMessage });
            }
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.default = auth_router;
//# sourceMappingURL=Auth.js.map