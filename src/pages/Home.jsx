import { useState, useEffect } from "react";
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
  const [countdown, setCountdown] = useState({ days: 2, hours: 0, minutes: 0, seconds: 0 });
  const [textRevealed, setTextRevealed] = useState(false);

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

  // Countdown Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // GSAP Text Reveal Effect with Engaging Animations
  useEffect(() => {
    const revealElement = document.querySelector(".text-reveal-large");
    const chooseText = document.querySelector(".choose-text");
    const chooseSubtexts = document.querySelectorAll(".choose-subtext");
    
    if (revealElement && !textRevealed) {
      const words = revealElement.querySelectorAll(".word");
      gsap.set(words, { x: -100, opacity: 0 });
      gsap.set(chooseSubtexts, { y: 20, opacity: 0 });
      
      gsap.to(words, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: revealElement,
          start: "top center",
          end: "top 20%",
          scrub: 0.5,
          onEnter: () => {
            setTextRevealed(true);
            if (chooseText) {
              chooseText.classList.add("revealed");
            }
            // Animate subtext after main text
            gsap.to(chooseSubtexts, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.15,
              delay: 0.4,
            });
          },
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [textRevealed]);

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

      {/* TEXT REVEAL & COUNTDOWN SECTION */}
      <div className="text-countdown-section container">
        {/* Large Text Reveal */}
        <div className="text-reveal-large">
          <span className="word">Jangan</span>
          <span className="word">Lupa</span>
          <span className="word">Segera</span>
          <span className="word">Gunakan</span>
          <span className="word">Hakmu!</span>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-container">
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.days).padStart(2, '0')}</span>
            <span className="countdown-label">Hari</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
            <span className="countdown-label">Jam</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">Menit</span>
          </div>
          <span className="countdown-separator">:</span>
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">Detik</span>
          </div>
        </div>

        {/* Question Text with Engaging Follow-up */}
        <div className="choose-question">
          <div className="choose-text-wrapper">
            <span className="choose-text">Sudahkah kamu memilih?</span>
            <div className="choose-subtext-container">
              <span className="choose-subtext">Jangan sia-siakan kesempatan emas ini!</span>
              <span className="choose-subtext">Suaramu penting untuk masa depan OSIS yang lebih baik 🗳️</span>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <motion.div
          className="video-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <video
            className="tutorial-video"
            controls
            width="100%"
            poster="/tutorial/poster.jpg"
          >
            <source src="/tutorial/tutorial.mp4" type="video/mp4" />
            Browser Anda tidak mendukung video HTML5
          </video>
        </motion.div>
      </div>

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

      {/* REPORT SECTION */}
      <motion.div 
        className="report-section container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="report-text">
          Jika ada masalah, segera melapor melalui Instagram.
        </p>
      </motion.div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

