import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({
    paslon1: 0,
    paslon2: 0,
    paslon3: 0,
    paslon4: 0,
  });
  const [votesByJurusan, setVotesByJurusan] = useState({});
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedJurusan, setSelectedJurusan] = useState("all");
  const [jurusanList, setJurusanList] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nisInput, setNisInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const tiktokCarouselRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  const kandidatList = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Anies Baswedan & Muhaimin Iskandar",
      warna: "#FF6B6B",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Prabowo Subianto & Gibran Rakabuming",
      warna: "#4ECDC4",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Ganjar Pranowo & Mahfud MD",
      warna: "#FFD93D",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Hari Poernomo & Sjaiful Bahri",
      warna: "#A8E6CF",
    },
  ];

  // Check if current user has voted
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const checkVoting = async () => {
        try {
          const userRef = doc(db, "users", user.nis);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().sudahVote) {
            setHasVoted(true);
          }
        } catch (err) {
          console.error("Error checking voting status:", err);
        }
      };
      checkVoting();
    }
  }, []);

  // Load visibility setting
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "votingVisibility");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setShowCarousel(settingsSnap.data().visible || false);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();

    // Also listen for real-time updates
    const settingsRef = doc(db, "settings", "votingVisibility");
    const unsubscribe = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setShowCarousel(snap.data().visible || false);
      }
    });

    return unsubscribe;
  }, []);

  // Setup GSAP Draggable for TikTok Carousel on Mobile
  useEffect(() => {
    const wrapper = tiktokCarouselRef.current?.querySelector('.tiktok-carousel-wrapper');
    if (!wrapper) return;

    // Enable dragging on mobile and desktop
    gsap.registerPlugin(gsap.utils.toArray ? null : {});
    
    gsap.set(".tiktok-carousel-wrapper", { transformOrigin: "center center", force3D: true });
    
    // Use Draggable if available, otherwise fallback to manual scroll
    let startX = 0;
    const handleMouseDown = (e) => {
      startX = e.clientX || e.touches?.[0]?.clientX;
    };
    
    const handleMouseMove = (e) => {
      if (startX === 0) return;
      const currentX = e.clientX || e.touches?.[0]?.clientX;
      const diff = startX - currentX;
      wrapper.scrollLeft += diff;
      startX = currentX;
    };
    
    const handleMouseUp = () => {
      startX = 0;
    };

    wrapper.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('touchstart', handleMouseDown);
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('touchmove', handleMouseMove);
    wrapper.addEventListener('mouseup', handleMouseUp);
    wrapper.addEventListener('touchend', handleMouseUp);
    wrapper.addEventListener('mouseleave', handleMouseUp);

    return () => {
      wrapper.removeEventListener('mousedown', handleMouseDown);
      wrapper.removeEventListener('touchstart', handleMouseDown);
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('touchmove', handleMouseMove);
      wrapper.removeEventListener('mouseup', handleMouseUp);
      wrapper.removeEventListener('touchend', handleMouseUp);
      wrapper.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  // Fetch voting data from Firebase
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("sudahVote", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const voteCount = {
        paslon1: 0,
        paslon2: 0,
        paslon3: 0,
        paslon4: 0,
      };
      
      const votesByJurusanData = {};
      const jurusanSet = new Set();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const vote = data.vote;
        const jurusan = data.jurusan || "Unknown";
        
        if (vote && voteCount[vote] !== undefined) {
          voteCount[vote]++;
        }
        
        jurusanSet.add(jurusan);
        
        if (!votesByJurusanData[jurusan]) {
          votesByJurusanData[jurusan] = {
            paslon1: 0,
            paslon2: 0,
            paslon3: 0,
            paslon4: 0,
          };
        }
        
        if (vote && votesByJurusanData[jurusan][vote] !== undefined) {
          votesByJurusanData[jurusan][vote]++;
        }
      });

      setVotes(voteCount);
      setVotesByJurusan(votesByJurusanData);
      
      // Set jurusan list
      const jurusans = ["all", ...Array.from(jurusanSet).sort()];
      setJurusanList(jurusans);
    });

    return unsubscribe;
  }, []);

  // Fetch comments from Obrolan for live notification
  useEffect(() => {
    const messagesRef = collection(db, "chats", "obrolan", "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const allComments = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        allComments.push({
          id: doc.id,
          nis: data.userId || data.nis || "Anonymous",
          pesan: data.message || data.pesan || "",
          timestamp: data.timestamp?.toMillis?.() || data.timestamp || new Date(),
        });
      });
      // Sort by timestamp descending (newest first)
      allComments.sort((a, b) => b.timestamp - a.timestamp);
      setComments(allComments);
    });

    return unsubscribe;
  }, []);

  // Timer to rotate comments every 2 seconds
  useEffect(() => {
    if (comments.length === 0) return;

    const timer = setInterval(() => {
      setCurrentCommentIndex((prev) => (prev + 1) % comments.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [comments.length]);

  // Handle chat login
  const handleChatClick = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser || hasVoted) {
      // Already logged in or voted
      navigate("/obrolan");
    } else {
      // Show login modal
      setShowLoginModal(true);
    }
  };

  // Handle NIS Token login for chat
  const handleChatLogin = async () => {
    if (!nisInput.trim() || !tokenInput.trim()) {
      alert("NIS dan Token harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      // Check if user exists in database
      const userRef = doc(db, "users", nisInput);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("NIS tidak ditemukan di database!");
        setIsLoading(false);
        return;
      }

      const userData = userSnap.data();
      // Validate token (simple check - can be enhanced with backend validation)
      if (userData.token !== tokenInput) {
        alert("Token tidak sesuai!");
        setIsLoading(false);
        return;
      }

      // Store user in localStorage for this session
      localStorage.setItem("currentUser", JSON.stringify({
        nis: nisInput,
        nama: userData.nama || nisInput,
        token: tokenInput
      }));

      // Close modal and navigate
      setShowLoginModal(false);
      setNisInput("");
      setTokenInput("");
      navigate("/obrolan");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // GSAP Text Reveal on Scroll with Proper ScrollTrigger
  useEffect(() => {
    const revealElement = document.querySelector(".text-reveal-large");
    if (!revealElement) return;

    const words = revealElement.querySelectorAll(".word");
    const chooseText = document.querySelector(".choose-text");
    const chooseSubtexts = document.querySelectorAll(".choose-subtext");

    if (words.length === 0) return;

    // Kill existing animations
    gsap.killTweensOf(words);
    if (chooseSubtexts) gsap.killTweensOf(chooseSubtexts);
    if (chooseText) gsap.killTweensOf(chooseText);

    // Set initial state - words start hidden
    gsap.set(words, { x: -50, opacity: 0 });
    if (chooseSubtexts.length > 0) {
      gsap.set(chooseSubtexts, { y: 20, opacity: 0 });
    }

    // Create timeline for scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: revealElement,
        start: "top 70%",
        end: "top 30%",
        scrub: 0.5,
        markers: false,
        once: false,
      }
    });

    // Animate words in on scroll
    tl.to(words, {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.05,
      ease: "power2.out"
    }, 0);

    // After words animate, animate the choose text
    tl.to(chooseText, {
      color: "#BF841D",
      duration: 0.8,
      ease: "power2.out"
    }, 0.5);

    // Animate subtext at the end
    if (chooseSubtexts.length > 0) {
      tl.to(chooseSubtexts, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, 0.8);
    }

    return () => {
      tl.kill();
    };
  }, []);

  const getDisplayData = () => {
    if (selectedJurusan === "all") {
      return votes;
    }
    return votesByJurusan[selectedJurusan] || {
      paslon1: 0,
      paslon2: 0,
      paslon3: 0,
      paslon4: 0,
    };
  };

  const getDisplayTotal = () => {
    const data = getDisplayData();
    return Object.values(data).reduce((a, b) => a + b, 0);
  };

  const getPercentage = (voteCount) => {
    const displayTotal = getDisplayTotal();
    if (displayTotal === 0) return 0;
    return Math.round((voteCount / displayTotal) * 100);
  };

  const displayData = getDisplayData();
  const displayTotal = getDisplayTotal();

  return (
    <>
      {/* STEPS */}
      <motion.div 
        className="steps-section container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="steps-wrapper">
          <h2 className="steps-top">3 Cara Kamu</h2>
          <div className="steps-bottom">Pilih OSIS</div>
        </div>
      </motion.div>

      <motion.div 
        className="steps-card-section container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="steps-card-grid">
          <div className="steps-card">
            <div className="steps-number">1</div>
            <img src="/steps/step-1.png" className="steps-image" alt="Kenali Paslon" />
            <h3>Kenali Paslon</h3>
            <p>Cermati visi, misi, dan program kerja Paslon OSIS.</p>
          </div>

          <div className="steps-card">
            <div className="steps-number">2</div>
            <img src="/steps/step-2.png" className="steps-image" alt="Pilih OSIS" />
            <h3>Pilih OSIS</h3>
            <p>Gunakan akses NIS kamu untuk memilih.</p>
          </div>

          <div className="steps-card">
            <div className="steps-number">3</div>
            <img src="/steps/step-3.png" className="steps-image" alt="Terpilih" />
            <h3>Terpilih</h3>
            <p>Pilihanmu tersimpan hingga pengumuman.</p>
          </div>
        </div>
      </motion.div>

      {/* SIMULASI CTA */}
      <motion.div 
        className="simulasi-section container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="simulasi-card">
          <div className="simulasi-text">
            <h2>
              TENTUKAN <br /> PILIHANMU!
            </h2>
            <button
              className="simulasi-btn"
              onClick={() => navigate("/login")}
            >
              Gaskeun!
            </button>
          </div>

          <div className="simulasi-image-single">
            <img src="/simulasi/foto-2.png" alt="Simulasi OSIS" />
          </div>
        </div>
      </motion.div>

      {/* VOTING RESULTS SECTION */}
      {showCarousel && (
        <motion.div 
          className="voting-results-section container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="voting-results-title">Hasil Pilih OSIS</h2>
          
          {/* Filter Jurusan */}
          {jurusanList.length > 1 && (
            <div className="voting-filter-container">
              <label className="filter-label">Filter Jurusan:</label>
              <select
                className="filter-select"
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
              >
                {jurusanList.map((jurusan) => (
                  <option key={jurusan} value={jurusan}>
                    {jurusan === "all" ? "Semua Jurusan" : jurusan}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Results Display */}
          <div className="voting-results-display">
            <div className="results-stats">
              <div className="stat-box">
                <span className="stat-label">Total Pemilih</span>
                <span className="stat-value">{displayTotal}</span>
              </div>
            </div>

            {/* Results Bars */}
            <div className="results-bars-container">
              {kandidatList.map((kandidat) => {
                const voteCount = displayData[kandidat.id];
                const percentage = getPercentage(voteCount);
                
                return (
                  <div key={kandidat.id} className="result-bar-item">
                    <div className="result-bar-header">
                      <div className="result-bar-title">
                        <span className="result-nomor">{kandidat.nomor}</span>
                        <span className="result-nama">{kandidat.nama}</span>
                      </div>
                      <div className="result-bar-stats">
                        <span className="result-votes">{voteCount}</span>
                        <span className="result-percentage">{percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="result-bar-background">
                      <div
                        className="result-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: kandidat.warna,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TIKTOK CAROUSEL SECTION */}
      <motion.div
        className="tiktok-carousel-section container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="tiktok-carousel-title">Ikuti TikTok Kita</h2>
        
        <div className="tiktok-carousel-container" ref={tiktokCarouselRef}>
          <div className="tiktok-carousel-wrapper">
            {/* Video 1 - Left */}
            <div className="tiktok-carousel-item">
              <iframe
                src="https://www.tiktok.com/embed/7601397395376622869"
                width="300"
                height="550"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="tiktok-iframe"
                title="TikTok Video 1"
              />
            </div>

            {/* Video 2 - Center */}
            <div className="tiktok-carousel-item">
              <iframe
                src="https://www.tiktok.com/embed/7550179419525074232"
                width="300"
                height="550"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="tiktok-iframe"
                title="TikTok Video 2"
              />
            </div>

            {/* Video 3 - Right */}
            <div className="tiktok-carousel-item">
              <iframe
                src="https://www.tiktok.com/embed/7560680511304158475"
                width="300"
                height="550"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="tiktok-iframe"
                title="TikTok Video 3"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER */}
      <Footer />

      {/* CHAT BUTTON - VISIBLE TO ALL USERS */}
      <motion.button
        className="chat-button-floating"
        onClick={handleChatClick}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -15, 0],
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10,
          y: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>

      {/* LOGIN MODAL FOR CHAT */}
      {showLoginModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowLoginModal(false);
            setNisInput("");
            setTokenInput("");
          }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Login untuk Chat</h2>
            <p>Masukkan NIS dan Token untuk mengakses ruang obrolan</p>
            
            <input
              type="text"
              placeholder="NIS"
              value={nisInput}
              onChange={(e) => setNisInput(e.target.value)}
              disabled={isLoading}
            />
            
            <input
              type="password"
              placeholder="Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              disabled={isLoading}
            />
            
            <div className="modal-buttons">
              <button
                onClick={handleChatLogin}
                disabled={isLoading}
                className="btn-login"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setNisInput("");
                  setTokenInput("");
                }}
                disabled={isLoading}
                className="btn-cancel"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* LIVE COMMENT NOTIFICATION - BOTTOM LEFT */}
      <div className="comment-notification-container">
        {comments.length > 0 && (
          <motion.div
            key={`comment-${comments[currentCommentIndex]?.id}`}
            className="comment-notification-item"
            initial={{ y: 150, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            onAnimationComplete={() => {
              // Optional: Add fade out before transitioning to next comment
            }}
          >
            <div className="comment-nis">
              nis: {comments[currentCommentIndex]?.nis}
            </div>
            <div className="comment-text">
              {comments[currentCommentIndex]?.pesan}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

