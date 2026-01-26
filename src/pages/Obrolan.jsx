import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../components/NotificationPopup.css";

export default function Obrolan() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    // Fetch comments from Firestore
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = [];
      snapshot.docs.forEach((doc) => {
        commentsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      // Sort by timestamp, newest first
      commentsList.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setComments(commentsList);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const commentsRef = collection(db, "comments");
      await addDoc(commentsRef, {
        nis: currentUser?.nis,
        nama: currentUser?.nama,
        kelas: currentUser?.kelas,
        message: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending comment:", err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Baru saja";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m lalu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}j lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <>
      <Navbar />
      <div className="obrolan-page">
        <div className="obrolan-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Kembali
          </button>
          <h1>Yukk! Ceritakan pengalamanmu di Pilih Osis</h1>
          <p>Bagikan pendapatmu dengan teman-teman</p>
        </div>

        {/* Comments List */}
        <div className="obrolan-comments">
          {loading ? (
            <div className="loading">Memuat komentar...</div>
          ) : comments.length === 0 ? (
            <div className="no-comments">
              <p>Belum ada komentar. Jadilah yang pertama!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.nama?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-nama">{comment.nama}</span>
                    <span className="comment-kelas">{comment.kelas}</span>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p className="comment-message">{comment.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Comment */}
        <div className="obrolan-input-section">
          <form onSubmit={handleSendComment} className="obrolan-form">
            <input
              type="text"
              placeholder="Tulis komentarmu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="obrolan-input"
            />
            <button type="submit" className="obrolan-send-btn">
              Kirim
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
