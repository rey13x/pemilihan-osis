import { useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ChatBubble() {
  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          return;
        }

        const userRef = doc(db, "users", currentUser.nis);
        const userSnap = await getDoc(userRef);
        
        // User voting status checked but component is disabled
      } catch (err) {
        console.error("Error checking voting status:", err);
      }
    };

    checkVotingStatus();
  }, []);

  // ChatBubble disabled - no more chat feature
  return null;
}
