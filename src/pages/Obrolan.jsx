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
  limit,
  getDocs,
  where
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
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginNis, setLoginNis] = useState("");
  const [loginToken, setLoginToken] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    if (messages.length === 0) return;
    gsap.utils.toArray(".message-item").forEach((msg, i) => {
      gsap.fromTo(msg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: i * 0.05 });
    });
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages from Firestore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("Setting up Firestore listener...");
    try {
      const messagesRef = collection(db, "chats", "obrolan", "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"), limit(100));
      
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          console.log("Got snapshot with", snapshot.docs.length, "messages");
          const messagesList = [];
          let userMsg = null;
          
          snapshot.docs.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            messagesList.push(data);
            if (currentUser && data.userId === currentUser.nis) {
              userMsg = data;
            }
          });
          
          setMessages(messagesList);
          setUserMessage(userMsg);
          setTotalMessages(messagesList.length);
          setIsRoomLocked(messagesList.length >= 100);
          setLoading(false);
        },
        (err) => {
          console.error("Firestore error:", err);
          setError(err.message);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    } catch (err) {
      console.error("Setup error:", err);
      setError(err.message);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    
    if (userMessage) {
      alert("Kamu hanya bisa mengirim 1 pesan");
      return;
    }
    
    if (isRoomLocked && !userMessage) {
      alert("Chat sudah penuh");
      return;
    }

    setSending(true);
    try {
      const messagesRef = collection(db, "chats", "obrolan", "messages");
      await addDoc(messagesRef, {
        userId: currentUser.nis,
        nis: currentUser.nis,
        username: currentUser.nis,
        kelas: currentUser.kelas || "-",
        message: message.trim(),
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
      alert("Error: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleChatLogin = async (e) => {
    e.preventDefault();
    if (!loginNis || !loginToken) {
      alert("NIS dan Token harus diisi");
      return;
    }
    
    try {
      // Validate against Firebase users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("nis", "==", loginNis));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        alert("NIS tidak ditemukan");
        return;
      }
      
      const userData = snapshot.docs[0].data();
      if (userData.token === loginToken) {
        setCurrentUser({
          nis: loginNis,
          token: loginToken,
          kelas: userData.kelas || "-"
        });
        setShowLoginModal(false);
        setLoginNis("");
        setLoginToken("");
      } else {
        alert("Token salah");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (window.confirm("Hapus pesan?")) {
      try {
        await deleteDoc(doc(db, "chats", "obrolan", "messages", msgId));
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  const handleEditMessage = async (msgId) => {
    if (!editingText.trim()) return;
    try {
      await updateDoc(doc(db, "chats", "obrolan", "messages", msgId), {
        message: editingText.trim(),
        edited: true,
      });
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = now - date;
      if (diff < 60000) return "Baru saja";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}j`;
      return date.toLocaleDateString("id-ID");
    } catch (e) {
      return "";
    }
  };

  return (
    <>
      <Navbar />
      
      {showLoginModal && (
        <motion.div className="obrolan-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="obrolan-modal" initial={{ scale: 0.9, y: -50 }} animate={{ scale: 1, y: 0 }}>
            <h2>Masuk untuk Komentar</h2>
            <p>Masukkan NIS dan Token kamu</p>
            <form onSubmit={handleChatLogin}>
              <input type="text" placeholder="NIS" value={loginNis} onChange={(e) => setLoginNis(e.target.value)} required />
              <input type="password" placeholder="Token" value={loginToken} onChange={(e) => setLoginToken(e.target.value)} required />
              <button type="submit">Masuk</button>
            </form>
            <button className="close-modal" onClick={() => setShowLoginModal(false)}>Tutup</button>
          </motion.div>
        </motion.div>
      )}

      {error && <div style={{ padding: "20px", background: "#ffebee", color: "#c62828" }}>⚠️ {error}</div>}

      <motion.div className="obrolan-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div className="obrolan-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button className="back-button" onClick={() => navigate("/")}>← Kembali</button>
          <h1>Obrolan Pemilih OSIS</h1>
          <p>Bagikan pengalamanmu</p>
          <div className="message-counter">{totalMessages}/100 pesan</div>
          {isRoomLocked && <div className="room-locked-banner">🔒 Chat penuh</div>}
        </motion.div>

        <motion.div className="obrolan-messages" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
          {loading && <div className="loading">Memuat pesan...</div>}
          {!loading && messages.length === 0 && <div className="no-messages"><p>Jadilah yang pertama mengirim pesan!</p></div>}
          {!loading && messages.map((msg) => (
            <div key={msg.id} className={`message-item ${msg.userId === currentUser?.nis ? 'user-message' : ''}`}>
              <div className="message-avatar"><img src="/info/profil.png" alt="avatar" /></div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-name">NIS: {msg.nis || msg.userId}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                  {msg.edited && <span className="message-edited">(diedit)</span>}
                </div>
                {editingId === msg.id ? (
                  <div className="edit-form">
                    <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="edit-input" />
                    <button onClick={() => handleEditMessage(msg.id)}>Simpan</button>
                    <button onClick={() => setEditingId(null)}>Batal</button>
                  </div>
                ) : (
                  <p className="message-text">{msg.message}</p>
                )}
                {msg.userId === currentUser?.nis && editingId !== msg.id && (
                  <div className="message-actions">
                    <button onClick={() => { setEditingId(msg.id); setEditingText(msg.message); }}>Edit</button>
                    <button onClick={() => handleDeleteMessage(msg.id)}>Hapus</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </motion.div>

        {!userMessage && !isRoomLocked && (
          <div className="obrolan-input-section">
            {!currentUser ? (
              <button className="obrolan-login-btn" onClick={() => setShowLoginModal(true)}>🔐 Masuk untuk Kirim Pesan</button>
            ) : (
              <form onSubmit={handleSendMessage} className="obrolan-form">
                <input type="text" placeholder="Tulis pesanmu..." value={message} onChange={(e) => setMessage(e.target.value)} className="obrolan-input" disabled={sending} />
                <button type="submit" className="obrolan-send-btn" disabled={sending || !message.trim()}>{sending ? "Kirim..." : "Kirim"}</button>
              </form>
            )}
          </div>
        )}

        {userMessage && <div className="obrolan-locked"><p>✓ Pesan kamu sudah terkirim</p></div>}
        {isRoomLocked && !userMessage && <div className="obrolan-full"><p>🔒 Chat sudah penuh</p></div>}
      </motion.div>
    </>
  );
}
