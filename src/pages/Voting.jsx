import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Voting() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

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

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("sudahVote", "==", true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const voteCount = {
            paslon1: 0,
            paslon2: 0,
            paslon3: 0,
            paslon4: 0,
          };

          snapshot.docs.forEach((doc) => {
            const vote = doc.data().vote;
            if (vote && voteCount[vote] !== undefined) {
              voteCount[vote]++;
            }
          });

          setVotes(voteCount);
          setTotalVotes(Object.values(voteCount).reduce((a, b) => a + b, 0));
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        console.error("Error fetching votes:", err);
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  const getPercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const getWinner = () => {
    if (totalVotes === 0) return null;
    return Object.entries(votes).reduce((a, b) =>
      votes[a[0]] > votes[b[0]] ? a : b
    );
  };

  const winner = getWinner();
  const winnerCandidate = winner
    ? kandidatList.find((k) => k.id === winner[0])
    : null;

  return (
    <div className="voting-page">
      <Navbar />
      <button className="back-button" onClick={() => navigate("/")}>
        ← Kembali
      </button>
      {/* Header */}
      <motion.div
        className="voting-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Hasil Sementara Voting</h1>
        <p>Total Vote: {totalVotes}</p>
      </motion.div>

      {/* Results Container */}
      <div className="voting-results">
        {loading ? (
          <div className="loading-state">
            <p>Loading results...</p>
          </div>
        ) : totalVotes === 0 ? (
          <div className="empty-state">
            <p>Belum ada voting</p>
          </div>
        ) : (
          <>
            {/* Results Bars */}
            <div className="results-container">
              {kandidatList.map((kandidat, index) => (
                <motion.div
                  key={kandidat.id}
                  className="result-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="result-header">
                    <div className="result-title">
                      <span className="nomor">{kandidat.nomor}</span>
                      <span className="nama">{kandidat.nama}</span>
                    </div>
                    <div className="result-stats">
                      <span className="votes">{votes[kandidat.id]}</span>
                      <span className="percentage">
                        {getPercentage(votes[kandidat.id])}%
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar"
                      style={{ backgroundColor: kandidat.warna }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          totalVotes > 0
                            ? (votes[kandidat.id] / totalVotes) * 100
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Winner Banner */}
            {winnerCandidate && (
              <motion.div
                className="winner-banner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="winner-content">
                  <span className="winner-badge">👑 PEMENANG</span>
                  <h2>{winnerCandidate.nama}</h2>
                  <p>
                    {votes[winnerCandidate.id]} suara dari {totalVotes} total
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <motion.div
        className="voting-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button className="voting-btn" onClick={() => navigate("/")}>
          Kembali ke Home
        </button>
      </motion.div>
    </div>
  );
}
