"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FireBase_1 = require("../FireBase/FireBase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const FireBase_2 = __importDefault(require("../FireBase/FireBase")); // Assuming you have a Firestore instance exported from FireBase file
const auth_router = (0, express_1.Router)();
// Register a new user
auth_router.post("/sign_up", async (req, res) => {
    const { email, password, user_name } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userRecord = await FireBase_1.auth.createUser({
            email,
            password: password,
            displayName: user_name
        });
        await FireBase_2.default.collection('User').doc(userRecord.uid).set({
            id: userRecord.uid,
            user_name,
            password: hashedPassword,
            saved_recipe_ids: [],
        });
        const token = await FireBase_1.auth.createCustomToken(userRecord.uid, { user_name });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: userRecord.uid,
                user_name
            }
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
auth_router.post("/login", async (req, res) => {
    var _a;
    const { email, password } = req.body;
    try {
        const user = await FireBase_1.auth.getUserByEmail(email);
        const userDoc = await FireBase_2.default.collection('User').doc(user.uid).get();
        if (!userDoc.exists) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.password) || "");
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = await FireBase_1.auth.createCustomToken(user.uid, { user_name: user.displayName });
        res.status(200).json({
            message: "User signed in successfully",
            user: {
                id: user.uid,
                user_name: user.displayName
            },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: "An unknown error occurred" });
    }
    return;
});
exports.default = auth_router;
//# sourceMappingURL=Auth.js.map