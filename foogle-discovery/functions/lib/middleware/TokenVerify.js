"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const FireBase_1 = require("../FireBase/FireBase");
async function verifyToken(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
        ;
    }
    try {
        const decodedToken = await FireBase_1.admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
        ;
    }
}
exports.verifyToken = verifyToken;
async function generateToken(id) {
    try {
        const token = await FireBase_1.admin.auth().createCustomToken(id);
        return token;
    }
    catch (error) {
        return null;
    }
}
exports.generateToken = generateToken;
//# sourceMappingURL=TokenVerify.js.map