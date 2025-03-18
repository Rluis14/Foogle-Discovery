// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // ✅ Added Realtime Database import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtW7fszphx2QunGFf6hqdYs1V8P_j5cK8",
  authDomain: "foogle-612c9.firebaseapp.com",
  databaseURL: "https://foogle-612c9-default-rtdb.firebaseio.com", // ✅ Added Database URL
  projectId: "foogle-612c9",
  storageBucket: "foogle-612c9.appspot.com",
  messagingSenderId: "988667291686",
  appId: "1:988667291686:web:4ae62cb93d641e2660dee7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // ✅ Initialize Realtime Database

// Export services
export { app, auth, db, database };
