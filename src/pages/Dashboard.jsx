import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CameraGallery from "../components/CameraGallery";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import NotificationPopup from "../components/NotificationPopup";

// Utility untuk Simpan CSV
const SimpanCSV = (data, filename) => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("Simpan", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csv = [headers.join(",")];
  
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape quotes in values
      return typeof value === "string" && value.includes(",")
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    csv.push(values.join(","));
  });
  
  return csv.join("\n");
};

// Modal untuk detail paslon
const PasalonDetailModal = ({ isOpen, paslon, allData, onClose, jurusanList }) => {
  const [selectedJurusan, setSelectedJurusan] = useState("all");

  if (!isOpen || !paslon) return null;

  // Get data untuk paslon yang dipilih
  const getPasalonVotes = () => {
    if (selectedJurusan === "all") {
      return allData.votes[paslon.id] || 0;
    }
    return (allData.votesByJurusan[selectedJurusan]?.[paslon.id]) || 0;
  };

  // Filter voters untuk paslon dan jurusan ini
  const getFilteredVoters = () => {
    let filtered = allData.voterDetails.filter(v => v.vote === paslon.id);
    
    if (selectedJurusan !== "all") {
      filtered = filtered.filter(v => v.jurusan === selectedJurusan);
    }
    
    return filtered;
  };

  // Get vote summary untuk paslon ini grouped by jurusan
  const getJurusanSummary = () => {
    const summary = {};
    Object.entries(allData.votesByJurusan).forEach(([jurusan, votes]) => {
      summary[jurusan] = votes[paslon.id] || 0;
    });
    return summary;
  };

  const filteredVoters = getFilteredVoters();
  const jurusanSummary = getJurusanSummary();

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="modal-content paslon-detail-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button className="modal-close" onClick={onClose}>✕</button>

          {/* Header */}
          <div className="modal-header" style={{ borderBottomColor: paslon.color }}>
            <div className="modal-header-content">
              <span className="modal-nomor" style={{ backgroundColor: paslon.color }}>
                {paslon.nomor}
              </span>
              <div>
                <h2>{paslon.nama}</h2>
                <p className="modal-total-votes">{getPasalonVotes()} Suara</p>
              </div>
            </div>
          </div>

          {/* Filter Jurusan */}
          <div className="modal-filter">
            <label>Filter Jurusan:</label>
            <select value={selectedJurusan} onChange={(e) => setSelectedJurusan(e.target.value)}>
              <option value="all">Semua Jurusan</option>
              {jurusanList.filter(j => j !== "all").map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Rincian Jurusan */}
          <div className="modal-section">
            <h3>Rincian per Jurusan</h3>
            <div className="table-wrapper">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Jurusan</th>
                    <th>Suara</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(jurusanSummary).map(([jurusan, votes]) => {
                    const totalJurusan = (allData.votesByJurusan[jurusan]?.paslon1 || 0) +
                                        (allData.votesByJurusan[jurusan]?.paslon2 || 0) +
                                        (allData.votesByJurusan[jurusan]?.paslon3 || 0) +
                                        (allData.votesByJurusan[jurusan]?.paslon4 || 0);
                    const percentage = totalJurusan > 0 ? ((votes / totalJurusan) * 100).toFixed(1) : 0;
                    return (
                      <tr key={jurusan}>
                        <td>{jurusan}</td>
                        <td className="votes-cell">{votes}</td>
                        <td className="percentage-cell">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Pemilih */}
          <div className="modal-section">
            <h3>Detail Pemilih ({filteredVoters.length})</h3>
            <div className="table-wrapper">
              <table className="detail-table voters-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>NIS</th>
                    <th>Kelas</th>
                    <th>Jurusan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.map((voter, idx) => (
                    <tr key={idx}>
                      <td className="no-cell">{idx + 1}</td>
                      <td className="nis-cell">{voter.nis}</td>
                      <td>{voter.kelas}</td>
                      <td>{voter.jurusan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simpan Buttons */}
          <div className="modal-actions">
            <button 
              className="btn-Simpan"
              onClick={() => {
                const voters = getFilteredVoters().map((v, idx) => ({
                  No: idx + 1,
                  NIS: v.nis,
                  Kelas: v.kelas,
                  Jurusan: v.jurusan
                }));
                const jurusanFilter = selectedJurusan === "all" ? "semua-jurusan" : selectedJurusan;
                SimpanCSV(voters, `pemilih_${paslon.id}_${jurusanFilter}.csv`);
              }}
            >
              Simpan CSV
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


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

  const [selectedPaslon, setSelectedPaslon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              className={`paslon-card ${paslon.id} clickable`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSelectedPaslon(paslon);
                setIsModalOpen(true);
              }}
              style={{ cursor: "pointer" }}
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

              {/* Click Hint */}
              <div className="paslon-click-hint">Klik untuk detail</div>
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

      {/* Simpan Section */}
      <motion.div
        className="dashboard-Simpan-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Simpan Laporan</h2>
        <div className="Simpan-grid">
          <button 
            className="Simpan-btn"
            onClick={() => {
              // Simpan all voters data
              const data = dashboardData.voterDetails
                .sort((a, b) => a.nis.localeCompare(b.nis))
                .map((v, idx) => ({
                  No: idx + 1,
                  NIS: v.nis,
                  Kelas: v.kelas,
                  Jurusan: v.jurusan,
                  Vote: v.vote,
                  "Voted At": new Date(v.votedAt).toLocaleString()
                }));
              SimpanCSV(data, `pemilih_semua_${new Date().toISOString().split('T')[0]}.csv`);
              setNotification({
                isOpen: true,
                type: "success",
                message: "Simpan berhasil!"
              });
            }}
          >
            Simpan Semua Pemilih
          </button>

          <button 
            className="Simpan-btn"
            onClick={() => {
              // Simpan summary by jurusan
              const data = Object.entries(dashboardData.votesByJurusan).map(([jurusan, votes]) => ({
                Jurusan: jurusan,
                Paslon1: votes.paslon1 || 0,
                Paslon2: votes.paslon2 || 0,
                Paslon3: votes.paslon3 || 0,
                Paslon4: votes.paslon4 || 0,
                Total: (votes.paslon1 || 0) + (votes.paslon2 || 0) + (votes.paslon3 || 0) + (votes.paslon4 || 0)
              }));
              SimpanCSV(data, `ringkasan_jurusan_${new Date().toISOString().split('T')[0]}.csv`);
              setNotification({
                isOpen: true,
                type: "success",
                message: "Simpan berhasil!"
              });
            }}
          >
            Simpan Ringkasan Jurusan
          </button>

          <button 
            className="Simpan-btn"
            onClick={() => {
              // Simpan summary by paslon
              const paslon1Voters = dashboardData.voterDetails.filter(v => v.vote === 'paslon1');
              const paslon2Voters = dashboardData.voterDetails.filter(v => v.vote === 'paslon2');
              const paslon3Voters = dashboardData.voterDetails.filter(v => v.vote === 'paslon3');
              const paslon4Voters = dashboardData.voterDetails.filter(v => v.vote === 'paslon4');

              const data = [{
                Paslon: "Paslon 1",
                "Total Suara": paslon1Voters.length,
                Persentase: ((paslon1Voters.length / dashboardData.totalVotes) * 100).toFixed(2) + '%'
              }, {
                Paslon: "Paslon 2",
                "Total Suara": paslon2Voters.length,
                Persentase: ((paslon2Voters.length / dashboardData.totalVotes) * 100).toFixed(2) + '%'
              }, {
                Paslon: "Paslon 3",
                "Total Suara": paslon3Voters.length,
                Persentase: ((paslon3Voters.length / dashboardData.totalVotes) * 100).toFixed(2) + '%'
              }, {
                Paslon: "Paslon 4",
                "Total Suara": paslon4Voters.length,
                Persentase: ((paslon4Voters.length / dashboardData.totalVotes) * 100).toFixed(2) + '%'
              }];
              SimpanCSV(data, `ringkasan_paslon_${new Date().toISOString().split('T')[0]}.csv`);
              setNotification({
                isOpen: true,
                type: "success",
                message: "Simpan berhasil!"
              });
            }}
          >
            Simpan Ringkasan Paslon
          </button>
        </div>
      </motion.div>

      {/* Camera Gallery Section */}
      <CameraGallery />

      {/* Voting Results Toggle & Display */}
      <motion.div
        className="dashboard-voting-results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
      </motion.div>

      {/* Modal Detail Paslon */}
      <PasalonDetailModal 
        isOpen={isModalOpen}
        paslon={selectedPaslon}
        allData={dashboardData}
        onClose={() => setIsModalOpen(false)}
        jurusanList={jurusanList}
      />
      </div>
    </>
  );
}
