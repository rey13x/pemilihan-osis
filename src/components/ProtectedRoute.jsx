import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

export default function ProtectedRoute({ children }) {
  if (!auth.currentUser) return <Navigate to="/login" />;
  return children;
}
