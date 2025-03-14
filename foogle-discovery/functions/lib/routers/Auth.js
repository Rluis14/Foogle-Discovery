"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FireBase_1 = require("../FireBase/FireBase");
const axios_1 = __importDefault(require("axios"));
const params_1 = require("firebase-functions/params");
const auth_router = (0, express_1.Router)();
const api_key = (0, params_1.defineSecret)("FIREBASE_API_KEY");
// Register a new user
auth_router.post("/register", async (req, res) => {
    const { email, password, user_name } = req.body;
    try {
        const userRecord = await FireBase_1.auth.createUser({
            email,
            password,
            displayName: user_name
        });
        const token = await FireBase_1.auth.createCustomToken(userRecord.uid);
        res.status(201).json({
            message: "User registered successfully",
            user: userRecord,
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Sign in a user
auth_router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Use Firebase Authentication REST API to verify email and password
        const response = await axios_1.default.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key.value()}`, {
            email,
            password,
            returnSecureToken: true
        });
        const { idToken, localId } = response.data;
        const user = await FireBase_1.auth.getUser(localId);
        const token = await FireBase_1.auth.createCustomToken(localId, { user_name: user.displayName });
        res.status(200).json({
            message: "User signed in successfully",
            user,
            token,
            idToken
        });
    }
    catch (error) {
        res.status(500).json({ error: error.response.data.error.message });
    }
});
exports.default = auth_router;
//# sourceMappingURL=Auth.js.map