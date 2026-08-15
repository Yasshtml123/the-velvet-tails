import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5gsYtGhQBx42F6PxE-gT4RWcuXB-IbxM",
  authDomain: "the-velvet-tails-4e6d3.firebaseapp.com",
  projectId: "the-velvet-tails-4e6d3",
  storageBucket: "the-velvet-tails-4e6d3.firebasestorage.app",
  messagingSenderId: "585149737295",
  appId: "1:585149737295:web:07baa835582f24fa90fd3a",
  measurementId: "G-MJDHYJMZKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
