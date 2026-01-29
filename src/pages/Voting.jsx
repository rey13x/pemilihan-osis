import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);

export default function Voting() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  const kandidatList = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Paslon 1",
      subtitle: "Shandyka Dhavid & Virgina Zanuba Khafsoh",
      tagline: "SATU SUARA, SATU TUJUAN, BERSAMA 01, WUJUDKAN IMPIAN",
      warna: "#FF6B6B",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Paslon 2",
      subtitle: "Aulia Najibah & Reza Rizki Pratama",
      tagline: "Be Wise, We Lead You",
      warna: "#4ECDC4",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Paslon 3",
      subtitle: "Fitri Ramadhani & Reefly Aprilian",
      tagline: "Tak Banyak Kata, Tunjukan Aksi Nyata",
      warna: "#FFD93D",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Paslon 4",
      subtitle: "Rahmat Alfian & Muhamad Yusuf",
      tagline: "Konsisten dengan satu tujuan membawa perubahan bergerak untuk masa depan",
      warna: "#A8E6CF",
    },
  ];

  // Fetch votes from Firebase
  useEffect(() => {
    const votesRef = collection(db, "votes");
    const q = query(votesRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const voteData = {
        paslon1: 0,
        paslon2: 0,
        paslon3: 0,
        paslon4: 0,
      };

      let total = 0;
      snapshot.forEach((doc) => {
        const vote = doc.data().vote;
        if (vote in voteData) {
          voteData[vote]++;
          total++;
        }
      });

      setVotes(voteData);
      setTotalVotes(total);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || loading) return;

    // Title animation
    gsap.fromTo(
      ".voting-title",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Result items staggered animation
    gsap.utils.toArray(".voting-result-item").forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2 + i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading]);

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="voting-page" ref={containerRef}>
        <div className="voting-container">
          <h1 className="voting-title">Hasil Real-time Voting OSIS</h1>
          <p className="voting-subtitle">Total Suara: {totalVotes}</p>

          <div className="voting-results">
            {kandidatList.map((kandidat) => {
              const voteCount = votes[kandidat.id] || 0;
              const percentage =
                totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;

              return (
                <div
                  key={kandidat.id}
                  className="voting-result-item"
                  style={{ borderLeftColor: kandidat.warna }}
                >
                  <div className="result-header">
                    <div className="result-title-block">
                      <h3>{kandidat.nama}</h3>
                      <p className="result-subtitle">{kandidat.subtitle}</p>
                    </div>
                    <span className="vote-count">{voteCount} suara</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: kandidat.warna,
                      }}
                    />
                  </div>

                  <p className="percentage">{percentage}%</p>
                </div>
              );
            })}
          </div>

          <button
            className="btn-back-voting"
            onClick={() => navigate("/")}
            style={{ marginTop: "40px" }}
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </>
  );
}