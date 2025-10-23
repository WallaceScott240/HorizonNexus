// src/config/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA9XJVOKDq_ow93m3jIsA39FEWg28NvuE", // Paste your keys here
  authDomain: "horizon-nexus.firebaseapp.com",
  projectId: "horizon-nexus",
  storageBucket: "horizon-nexus.firebasestorage.app",
  messagingSenderId: "275845224257",
  appId: "1:275845224257:web:88c6ff7c26d391a46533c0",
  measurementId: "G-WJXJQ000JC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

// in config/firebase.ts
import { getFunctions } from "firebase/functions";
// ... other imports

// ... after initializing app
export const functions = getFunctions(app);