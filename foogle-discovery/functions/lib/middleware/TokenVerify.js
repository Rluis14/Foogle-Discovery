"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const key_1 = __importDefault(require("../key"));
async function verifyToken(req, res, next, required = true) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
    if (!token && !required) {
        return next();
    }
    else if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, key_1.default);
        req.user = decodedToken;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
exports.verifyToken = verifyToken;
async function generateToken(id, user_name) {
    try {
        const token = jsonwebtoken_1.default.sign({ uid: id, user_name }, key_1.default, { expiresIn: "5h" });
        return token;
    }
    catch (error) {
        return null;
    }
}
exports.generateToken = generateToken;
//# sourceMappingURL=TokenVerify.js.map