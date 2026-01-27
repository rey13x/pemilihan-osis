import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowIfVoted = false }) {
  const currentUser = localStorage.getItem("currentUser");
  const currentUserData = currentUser ? JSON.parse(currentUser) : null;
  
  // Jika belum login, redirect ke login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Jika sudah voting dan tidak diizinkan akses setelah voting, redirect ke obrolan
  if (currentUserData?.sudahVote && !allowIfVoted) {
    return <Navigate to="/obrolan" />;
  }
  
  return children;
}
