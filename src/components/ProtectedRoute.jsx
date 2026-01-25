import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingLine from "./LoadingLine";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && !snap.data().sudahVoting) {
        setAllowed(true);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <LoadingLine />;
  if (!allowed) return <Navigate to="/" />;

  return children;
}
