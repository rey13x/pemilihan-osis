import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { db } from "../firebase/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc,
  orderBy,
  limit
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import "../components/NotificationPopup.css";

export default function Obrolan() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMessage, setUserMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [totalMessages, setTotalMessages] = useState(0);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [sending, setSending] = useState(false);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // GSAP animations for messages
  useEffect(() => {
    if (messages.length === 0) return;

    gsap.utils.toArray(".message-item").forEach((msg, i) => {
      gsap.fromTo(
        msg,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: i * 0.05,
        }
      );
    });
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    // Fetch messages from global chat room
    const messagesRef = collection(db, "chats", "obrolan", "messages");
    const q = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = [];
      let userMessageData = null;
      
      snapshot.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        messagesList.push(data);
        
        // Check if this message belongs to current user
        if (data.userId === user.nis) {
          userMessageData = data;
        }
      });
      
      setMessages(messagesList);
      setUserMessage(userMessageData);
      setTotalMessages(messagesList.length);
      
      // Lock room if 100 messages reached
      setIsRoomLocked(messagesList.length >= 100);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (userMessage) {
      alert("Kamu hanya bisa mengirim 1 pesan. Edit atau hapus pesan kamu untuk mengirim pesan baru.");
      return;
    }
    if (isRoomLocked && !userMessage) {
      alert("Chat sudah penuh (100 pesan). Tidak bisa mengirim pesan baru.");
      return;
    }

    setSending(true);
    try {
      const messagesRef = collection(db, "chats", "obrolan", "messages");
      await addDoc(messagesRef, {
        userId: currentUser?.nis,
        userName: currentUser?.nama,
        kelas: currentUser?.kelas,
        jurusan: currentUser?.jurusan,
        message: message.trim(),
        timestamp: serverTimestamp(),
        edited: false,
        editedAt: null,
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Hapus pesan ini?")) {
      try {
        await deleteDoc(doc(db, "chats", "obrolan", "messages", messageId));
        setUserMessage(null);
      } catch (err) {
        console.error("Error deleting message:", err);
        alert("Gagal menghapus pesan");
      }
    }
  };

  const handleEditMessage = async (messageId, newMessage) => {
    if (!newMessage.trim()) return;
    
    try {
      await updateDoc(doc(db, "chats", "obrolan", "messages", messageId), {
        message: newMessage.trim(),
        edited: true,
        editedAt: serverTimestamp(),
      });
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Error editing message:", err);
      alert("Gagal mengedit pesan");
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
      <motion.div 
        className="obrolan-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="obrolan-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="back-button" onClick={() => navigate("/")}>
            ← Kembali
          </button>
          <h1>Obrolan Pemilih OSIS</h1>
          <p>Bagikan pengalamanmu dengan teman-teman</p>
          <div className="message-counter">
            {totalMessages}/100 pesan
          </div>
          {isRoomLocked && (
            <div className="room-locked-banner">
              🔒 Chat penuh - semua pesan terkunci
            </div>
          )}
        </motion.div>

        {/* Messages List */}
        <motion.div 
          className="obrolan-messages"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {loading ? (
            <div className="loading">Memuat pesan...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <p>Jadilah yang pertama mengirim pesan!</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`message-item ${msg.userId === currentUser?.nis ? 'user-message' : ''} ${isRoomLocked ? 'locked' : ''}`}
                >
                  <div className="message-avatar">
                    {msg.userId?.substring(0, 2).toUpperCase() || "?"}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-name">{msg.userName}</span>
                      <span className="message-class">{msg.kelas}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                      {msg.edited && <span className="message-edited">(diedit)</span>}
                    </div>
                    
                    {editingId === msg.id ? (
                      <div className="edit-form">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="edit-input"
                          disabled={isRoomLocked}
                        />
                        <div className="edit-buttons">
                          <button 
                            className="edit-save-btn"
                            onClick={() => handleEditMessage(msg.id, editingText)}
                            disabled={isRoomLocked}
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
                        <p className="message-text">{msg.message}</p>
                        {msg.userId === currentUser?.nis && (
                          <div className="message-actions">
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => {
                                setEditingId(msg.id);
                                setEditingText(msg.message);
                              }}
                              disabled={isRoomLocked}
                            >
                              Edit
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </motion.div>

        {/* Input Message */}
        {!userMessage && !isRoomLocked && (
          <div className="obrolan-input-section">
            <form onSubmit={handleSendMessage} className="obrolan-form">
              <input
                type="text"
                placeholder="Tulis pesanmu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="obrolan-input"
                disabled={sending}
              />
              <button type="submit" className="obrolan-send-btn" disabled={sending || !message.trim()}>
                {sending ? "Kirim..." : "Kirim"}
              </button>
            </form>
          </div>
        )}
        
        {userMessage && (
          <div className="obrolan-locked">
            <p>✓ Pesan kamu sudah terkirim. Edit atau hapus untuk mengirim pesan baru.</p>
          </div>
        )}

        {isRoomLocked && !userMessage && (
          <div className="obrolan-full">
            <p>🔒 Chat sudah penuh. Semua pesan terkunci.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
