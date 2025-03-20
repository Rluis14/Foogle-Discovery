import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import JWT_KEY from "../key";
async function verifyToken(req: Request, res: Response, next: NextFunction,required=true) {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if(!token && !required){
        return next();
    }
    else if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token,JWT_KEY);
        (req as any).user = decodedToken;
        return next();
    } catch (error: any) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function checkToken(token:string){
    try {
        const decodedToken = jwt.verify(token,JWT_KEY);
        return decodedToken;
    } catch (error: any) {
        return null;
    }
}
async function generateToken(id: string,user_name:string) {
    try {
        const token = jwt.sign({ uid:id,user_name }, JWT_KEY, { expiresIn
        : "5h" });
        return token;
    } catch (error: any) {
        return null;
    }
}

export { generateToken, verifyToken,checkToken };