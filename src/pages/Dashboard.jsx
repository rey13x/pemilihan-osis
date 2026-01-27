import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import NotificationPopup from "../components/NotificationPopup";

const Paslon = [
  { id: "paslon1", nomor: "1", nama: "Paslon 1", foto: "/paslon/paslon-1.png", color: "#FF6B6B" },
  { id: "paslon2", nomor: "2", nama: "Paslon 2", foto: "/paslon/paslon-2.png", color: "#4ECDC4" },
  { id: "paslon3", nomor: "3", nama: "Paslon 3", foto: "/paslon/paslon-3.png", color: "#FFD93D" },
  { id: "paslon4", nomor: "4", nama: "Paslon 4", foto: "/paslon/paslon-4.png", color: "#A8E6CF" },
];

const PieChart = ({ data, title }) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const generatePieChart = () => {
    const kandidats = [
      { name: "Paslon 1", color: "#FF6B6B", value: data.paslon1 || 0 },
      { name: "Paslon 2", color: "#4ECDC4", value: data.paslon2 || 0 },
      { name: "Paslon 3", color: "#FFD93D", value: data.paslon3 || 0 },
      { name: "Paslon 4", color: "#A8E6CF", value: data.paslon4 || 0 },
    ];

    let offset = 0;
    const slices = kandidats.map((k) => {
      const percentage = total > 0 ? (k.value / total) * 100 : 0;
      const degrees = (percentage / 100) * 360;
      const slice = {
        ...k,
        percentage,
        degrees,
        offset,
      };
      offset += degrees;
      return slice;
    });

    return slices;
  };

  const slices = generatePieChart();
  let currentDegree = 0;

  return (
    <div className="pie-chart-container">
      <div className="pie-chart-wrapper">
        <svg viewBox="0 0 100 100" className="pie-chart-svg">
          {slices.map((slice, index) => {
            const startDegree = currentDegree;
            const endDegree = currentDegree + slice.degrees;
            currentDegree = endDegree;

            const startRadians = (startDegree * Math.PI) / 180;
            const endRadians = (endDegree * Math.PI) / 180;

            const x1 = 50 + 40 * Math.cos(startRadians);
            const y1 = 50 + 40 * Math.sin(startRadians);
            const x2 = 50 + 40 * Math.cos(endRadians);
            const y2 = 50 + 40 * Math.sin(endRadians);

            const largeArc = slice.degrees > 180 ? 1 : 0;
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <path
                key={index}
                d={path}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      <div className="pie-chart-legend">
        {slices.map((slice, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: slice.color }}
            />
            <div className="legend-text">
              <p className="legend-name">{slice.name}</p>
              <p className="legend-value">
                {slice.value} ({slice.percentage?.toFixed(1) || 0}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({
    admin: "",
    password: "",
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error",
    message: "",
  });

  const [dashboardData, setDashboardData] = useState({
    totalVotes: 0,
    votes: { paslon1: 0, paslon2: 0, paslon3: 0, paslon4: 0 },
    votesByJurusan: {},
    voterDetails: [], // Array of all voters with NIS
  });

  // Check for quick login shortcut on mount
  useEffect(() => {
    const quickLoginFlag = localStorage.getItem("adminQuickLogin");
    if (quickLoginFlag === "true") {
      setIsAuthenticated(true);
      localStorage.removeItem("adminQuickLogin"); // clean up
    }
  }, []);

  // Load voting visibility setting
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "votingVisibility");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setVotingResultsVisible(settingsSnap.data().visible || false);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, []);

  // Handle voting visibility toggle
  const handleVotingVisibilityToggle = async () => {
    setSettingsLoading(true);
    try {
      const settingsRef = doc(db, "settings", "votingVisibility");
      const newVisibility = !votingResultsVisible;
      await setDoc(settingsRef, { visible: newVisibility });
      setVotingResultsVisible(newVisibility);
      setNotification({
        isOpen: true,
        type: "success",
        message: newVisibility ? "Hasil voting ditampilkan" : "Hasil voting disembunyikan",
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      setNotification({
        isOpen: true,
        type: "error",
        message: "Gagal mengubah setting",
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const [selectedJurusan, setSelectedJurusan] = useState("all");
  const [jurusanList, setJurusanList] = useState([]);

  const [votingResultsVisible, setVotingResultsVisible] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Admin credentials
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "adminosis26";

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      loginForm.admin === ADMIN_USER &&
      loginForm.password === ADMIN_PASS
    ) {
      setIsAuthenticated(true);
      setNotification({
        isOpen: true,
        type: "success",
        message: "Login berhasil!",
      });
    } else {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Kredensial tidak valid",
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
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

          const votesByJurusan = {};
          const jurusanSet = new Set();
          const voterDetails = [];

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const vote = data.vote;
            const jurusan = data.jurusan || "Unknown";
            const nis = doc.id;
            const kelas = data.kelas || "Unknown";

            jurusanSet.add(jurusan);

            if (vote && voteCount[vote] !== undefined) {
              voteCount[vote]++;
            }

            if (!votesByJurusan[jurusan]) {
              votesByJurusan[jurusan] = {
                paslon1: 0,
                paslon2: 0,
                paslon3: 0,
                paslon4: 0,
              };
            }

            if (vote && votesByJurusan[jurusan][vote] !== undefined) {
              votesByJurusan[jurusan][vote]++;
            }

            // Add voter details
            voterDetails.push({
              nis,
              jurusan,
              kelas,
              vote,
              votedAt: data.votedAt || new Date().toISOString(),
            });
          });

          setDashboardData({
            totalVotes: Object.values(voteCount).reduce((a, b) => a + b, 0),
            votes: voteCount,
            votesByJurusan,
            voterDetails,
          });

          const jurusans = ["all", ...Array.from(jurusanSet)];
          setJurusanList(jurusans);
        });

        return unsubscribe;
      } catch (err) {
        console.error("Error fetching data:", err);
        setNotification({
          isOpen: true,
          type: "error",
          message: "Error fetching voting data: " + err.message,
        });
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const getDisplayData = () => {
    if (selectedJurusan === "all") {
      return dashboardData.votes;
    }
    return dashboardData.votesByJurusan[selectedJurusan] || {
      paslon1: 0,
      paslon2: 0,
      paslon3: 0,
    };
  };

  const getDisplayTotal = () => {
    const data = getDisplayData();
    return Object.values(data).reduce((a, b) => a + b, 0);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="dashboard-login-page">
        <motion.div
          className="dashboard-login-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Admin</h1>
          <p>Masukkan Akses Masuk Dashboard Admin</p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin"
              value={loginForm.admin}
              onChange={(e) =>
                setLoginForm({ ...loginForm, admin: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <button type="submit">Masuk</button>
          </form>

          <button className="back-home-btn" onClick={() => navigate("/")}>
            ← Kembali ke Home
          </button>
        </motion.div>

        <NotificationPopup
          isOpen={notification.isOpen}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isOpen: false })}
        />
        </div>
      </>
    );
  }

  const displayData = getDisplayData();
  const displayTotal = getDisplayTotal();

  return (
    <>
      <Navbar />
      <button className="back-button" onClick={() => navigate("/")}>
        ← Kembali
      </button>
      <div className="dashboard-page">
        <NotificationPopup
          isOpen={notification.isOpen}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isOpen: false })}
        />

        {/* Top Bar with Real-time Stats */}
      <motion.div
        className="dashboard-topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div className="topbar-item">
          <span className="topbar-label">Total Pemilih</span>
          <span className="topbar-value">{displayTotal}</span>
        </div>
        <div className="topbar-item topbar-leading">
          <span className="topbar-label">Unggul</span>
          <span className="topbar-value">
            {(() => {
              const data = getDisplayData();
              const max = Math.max(
                data.paslon1,
                data.paslon2,
                data.paslon3
              );
              if (max === 0) return "-";
              if (data.paslon1 === max) return "Paslon 1";
              if (data.paslon2 === max) return "Paslon 2";
              return "Paslon 3";
            })()}
          </span>
        </div>
        <div className="topbar-item">
          <span className="topbar-label">Filter</span>
          <span className="topbar-value">
            {selectedJurusan === "all" ? "Semua Jurusan" : selectedJurusan}
          </span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Dashboard Voting</h1>
          <p>Monitor hasil voting real-time</p>
        </div>

        <button className="logout-btn" onClick={() => navigate("/")}>
          Keluar
        </button>
      </motion.div>

      {/* Filter & Settings */}
      <motion.div
        className="dashboard-filter"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="filter-group">
          <label>Filter Jurusan:</label>
          <select
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
        
        <div className="toggle-group">
          <label>
            <input
              type="checkbox"
              checked={votingResultsVisible}
              onChange={handleVotingVisibilityToggle}
              disabled={settingsLoading}
            />
            <span>Tampilkan Hasil di Home</span>
          </label>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="dashboard-stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Paslon Cards dengan Foto */}
        {Paslon.map((paslon, idx) => {
          const voteKey = paslon.id;
          const votes = displayData[voteKey] || 0;
          const percentage = displayTotal > 0 ? ((votes / displayTotal) * 100).toFixed(2) : 0;
          
          return (
            <motion.div
              key={paslon.id}
              className={`paslon-card ${paslon.id}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Foto */}
              <div className="paslon-photo-container">
                <img 
                  src={paslon.foto} 
                  alt={paslon.nama}
                  className="paslon-photo"
                  onError={(e) => {
                    e.target.src = "/paslon/paslon-placeholder.png";
                  }}
                />
              </div>

              {/* Header dengan Nomor */}
              <div className="paslon-header" style={{ borderTopColor: paslon.color }}>
                <span className="paslon-nomor" style={{ backgroundColor: paslon.color }}>
                  {paslon.nomor}
                </span>
                <h3 className="paslon-title">{paslon.nama}</h3>
              </div>

              {/* Vote Info */}
              <div className="paslon-vote-info">
                <div className="vote-display">
                  <p className="paslon-vote">{votes}</p>
                  <p className="paslon-label">Suara</p>
                </div>
                <div className="percentage-display" style={{ color: paslon.color }}>
                  <p className="paslon-percentage">{percentage}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="paslon-progress">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: paslon.color
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart */}
      <motion.div
        className="dashboard-chart"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2>Hasil Voting</h2>
        <PieChart data={displayData} title="Distribution" />
      </motion.div>

      {/* Detailed Table - Summary by Jurusan */}
      <motion.div
        className="dashboard-table-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>Rincian per Jurusan</h2>
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Jurusan</th>
                <th>Paslon 1</th>
                <th>Paslon 2</th>
                <th>Paslon 3</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dashboardData.votesByJurusan).map(
                ([jurusan, votes]) => {
                  const total =
                    votes.paslon1 + votes.paslon2 + votes.paslon3;
                  return (
                    <tr key={jurusan}>
                      <td className="jurusan-name">{jurusan}</td>
                      <td>{votes.paslon1}</td>
                      <td>{votes.paslon2}</td>
                      <td>{votes.paslon3}</td>
                      <td className="total-cell">{total}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Voter Details Table with NIS */}
      <motion.div
        className="dashboard-voters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2>Detail Pemilih ({dashboardData.voterDetails.length})</h2>
        <div className="table-wrapper">
          <table className="dashboard-voters-table">
            <thead>
              <tr>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Jurusan</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.voterDetails
                .sort((a, b) => a.nis.localeCompare(b.nis))
                .map((voter, idx) => (
                  <tr key={idx}>
                    <td className="nis-cell">{voter.nis}</td>
                    <td>{voter.kelas}</td>
                    <td>{voter.jurusan}</td>
                    <td>
                      <span className={`vote-badge vote-${voter.vote}`}>
                        {voter.vote}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Voting Results Toggle & Display */}
      <motion.div
        className="dashboard-voting-results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
      </motion.div>
      </div>
    </>
  );
}
