import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
const app = admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();


export {app,admin,storage};
export default db;