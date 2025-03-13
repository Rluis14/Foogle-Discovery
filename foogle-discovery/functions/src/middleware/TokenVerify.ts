import { NextFunction, Request, Response } from "express";
import { admin } from "../FireBase/FireBaseDB";

async function verifyToken(req:Request, res:Response, next:NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });;
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken;
        return next();
    } catch (error: any) {
        return res.status(401).json({ error: "Invalid token" });;
    }
}

module.exports = verifyToken;