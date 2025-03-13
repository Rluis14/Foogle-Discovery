import { NextFunction, Request, Response } from "express";
import { admin } from "../FireBase/FireBase";

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken;
        return next();
    } catch (error: any) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

async function generateToken(id: string) {
    try {
        const user = await admin.auth().getUser(id);
        const token = await admin.auth().createCustomToken(id, { displayName: user.displayName });
        return token;
    } catch (error: any) {
        return null;
    }
}

export { generateToken, verifyToken };