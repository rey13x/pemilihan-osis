import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCspsxBnxtI2QBqDTQy3AsYv6WXZQDV6_o",
  authDomain: "osis2026-8a231.firebaseapp.com",
  projectId: "osis2026-8a231",
  storageBucket: "osis2026-8a231.firebasestorage.app",
  messagingSenderId: "706225836165",
  appId: "1:706225836165:web:fcbb220b23583ba264d9ec",
  measurementId: "G-DZ75Y0QVZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
