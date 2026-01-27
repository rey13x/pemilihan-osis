import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEH-o9AUTUf576tj_BdTbxxiOzTIPV3Pk",
  authDomain: "osis2026-ab377.firebaseapp.com",
  projectId: "osis2026-ab377",
  storageBucket: "osis2026-ab377.firebasestorage.app",
  messagingSenderId: "975888654604",
  appId: "1:975888654604:web:23a5eb8d80fed9a9eaa929",
  measurementId: "G-0HBPMX1WCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
