import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../components/NotificationPopup.css";

export default function Obrolan() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userComment, setUserComment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

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
      let userCommentData = null;
      
      snapshot.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        commentsList.push(data);
        
        // Check if this comment belongs to current user
        if (data.nis === user.nis) {
          userCommentData = data;
        }
      });
      
      // Sort by timestamp, newest first
      commentsList.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setComments(commentsList);
      setUserComment(userCommentData);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (userComment) {
      alert("Kamu hanya bisa mengirim 1 pesan. Edit atau hapus pesan kamu yang lama untuk mengirim pesan baru.");
      return;
    }

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

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Hapus pesan ini?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
        setUserComment(null);
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  const handleEditComment = async (commentId, newMessage) => {
    if (!newMessage.trim()) return;
    
    try {
      await updateDoc(doc(db, "comments", commentId), {
        message: newMessage,
        edited: true,
        editedAt: serverTimestamp(),
      });
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Error editing comment:", err);
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
              <div key={comment.id} className={`comment-item ${comment.nis === currentUser?.nis ? 'user-comment' : ''}`}>
                <div className="comment-avatar">
                  {comment.nis?.substring(0, 2).toUpperCase() || "?"}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-nama">{comment.nis}</span>
                    <span className="comment-kelas">{comment.kelas}</span>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                    {comment.edited && <span className="comment-edited">(diedit)</span>}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="edit-form">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="edit-input"
                      />
                      <div className="edit-buttons">
                        <button 
                          className="edit-save-btn"
                          onClick={() => handleEditComment(comment.id, editingText)}
                        >
                          Simpan
                        </button>
                        <button 
                          className="edit-cancel-btn"
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-message">{comment.message}</p>
                      {comment.nis === currentUser?.nis && (
                        <div className="comment-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditingText(comment.message);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Comment */}
        {!userComment && (
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
        )}
        
        {userComment && (
          <div className="obrolan-locked">
            <p>✓ Pesan kamu sudah terkirim. Edit atau hapus untuk mengirim pesan baru.</p>
          </div>
        )}
      </div>
    </>
  );
}
