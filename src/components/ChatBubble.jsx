import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ChatBubble() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVoted, setIsVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", currentUser.nis);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setIsVoted(userSnap.data().sudahVote || false);
        }
      } catch (err) {
        console.error("Error checking voting status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkVotingStatus();
  }, []);

  // Don't show on obrolan page
  if (location.pathname === "/obrolan" || !isVoted || loading) {
    return null;
  }

  return (
    <button
      className="chat-bubble"
      onClick={() => navigate("/obrolan")}
      title="Buka Obrolan"
    >
      <span className="chat-bubble-icon">💬</span>
    </button>
  );
}
