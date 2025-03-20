import { Router, Request, Response } from "express";
import { auth } from "../FireBase/FireBase";
import bcrypt from "bcrypt";
import db from "../FireBase/FireBase"; // Assuming you have a Firestore instance exported from FireBase file
import {
  checkToken,
  generateToken,
  verifyToken,
} from "../middleware/TokenVerify";

const auth_router = Router();

// Register a new user
auth_router.post("/sign_up", async (req: Request, res: Response) => {
  const { email, password, user_name } = req.body;
  console.log(email, password, user_name);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await auth.createUser({
      email,
      password: password,
      displayName: user_name,
    });

    await db.collection("User").doc(userRecord.uid).set({
      id: userRecord.uid,
      user_name,
      password: hashedPassword,
      saved_recipe_ids: [],
    });

    const token = generateToken(userRecord.uid, user_name);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userRecord.uid,
        user_name,
      },
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === "auth/email-already-exists") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Sign in a user
auth_router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await auth.getUserByEmail(email);
    const userDoc = await db.collection("User").doc(user.uid).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userDoc.data()?.password || ""
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.uid, user.displayName || " ");

    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user.uid,
        user_name: user.displayName,
      },
      token,
    });
  } catch (error: any) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  return;
});

// Sign in a user
auth_router.post("/token", async (req: Request, res: Response) => {
  const { token } = req.body;
  const user = checkToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }
  return res.status(200).json({
    message: "User signed in successfully",
    user: {
      id: (user as any).uid,
      user_name: (user as any).user_name,
    },
    token,
  });
});

export default auth_router;
