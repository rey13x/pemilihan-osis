import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBwbe9BRC5ftgezUBvbv99fKGtsdEgf93s",
  authDomain: "osis-smk2.firebaseapp.com",
  projectId: "osis-smk2",
  storageBucket: "osis-smk2.firebasestorage.app",
  messagingSenderId: "236480838961",
  appId: "1:236480838961:web:5a1c0a13a69fc034c9c410",
  measurementId: "G-C2MCG67XD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
