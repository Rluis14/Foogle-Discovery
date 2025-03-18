import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtW7fszphx2QunGFf6hqdYs1V8P_j5cK8",
  authDomain: "foogle-612c9.firebaseapp.com",
  databaseURL: "https://foogle-612c9-default-rtdb.firebaseio.com",
  projectId: "foogle-612c9",
  storageBucket: "foogle-612c9.firebasestorage.app",
  messagingSenderId: "988667291686",
  appId: "1:988667291686:web:4ae62cb93d641e2660dee7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);