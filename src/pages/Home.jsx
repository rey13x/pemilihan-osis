import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import Footer from "../components/Footer";

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

      {/* FOOTER */}
      <Footer />
    </>
  );
}

