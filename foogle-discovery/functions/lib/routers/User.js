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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenVerify_1 = require("../middleware/TokenVerify");
const FireBase_1 = __importStar(require("../FireBase/FireBase"));
const user_router = express_1.default.Router();
user_router.post("recipe/favorites/:id", TokenVerify_1.verifyToken, async (req, res) => {
    var _a;
    try {
        const userId = req.user.uid;
        const userRef = FireBase_1.default.collection("User").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        if (((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const { id } = req.body;
        // Add recipe_id to the user's favorites array
        await userRef.update({
            saved_recipe_ids: FireBase_1.admin.firestore.FieldValue.arrayUnion(id),
        });
        res.status(200).json({ message: "Recipe added to favorites" });
    }
    catch (err) {
        res.status(500).json({ error: "Unexpected error" });
    }
    return;
});
// Add delete route to remove recipe_id from favorites array
user_router.delete("/favorites/:id", TokenVerify_1.verifyToken, async (req, res) => {
    var _a;
    try {
        const userId = req.user.uid;
        const userRef = FireBase_1.default.collection("User").doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        if (((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.id) !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        // Remove recipe_id from the user's favorites array
        await userRef.update({
            saved_recipe_ids: FireBase_1.admin.firestore.FieldValue.arrayRemove(id),
        });
        res.status(200).json({ message: "Recipe removed from favorites" });
    }
    catch (err) {
        res.status(500).json({ error: "Unexpected error" });
    }
    return;
});
exports.default = user_router;
//# sourceMappingURL=User.js.map