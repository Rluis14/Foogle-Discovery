import * as admin from "firebase-admin";
const app = admin.initializeApp();
const db = admin.firestore();


export {admin,app};
export default db;