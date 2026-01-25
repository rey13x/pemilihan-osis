import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Gantilah dengan konfigurasi Firebase dari project Firebase kamu

const firebaseConfig = {
  apiKey: "AIzaSyBwbe9BRC5ftgezUBvbv99fKGtsdEgf93s",
  authDomain: "osis-smk2.firebaseapp.com",
  projectId: "osis-smk2",
  storageBucket: "osis-smk2.firebasestorage.app",
  messagingSenderId: "236480838961",
  appId: "1:236480838961:web:5a1c0a13a69fc034c9c410",
  measurementId: "G-C2MCG67XD2"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
