import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/NotificationPopup";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();

  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [token, setToken] = useState("");
  const [recentLogins, setRecentLogins] = useState([]);

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error",
    message: "",
  });

  useEffect(() => {
    // Load recent logins from localStorage
    const recent = JSON.parse(localStorage.getItem("recentLogins")) || [];
    setRecentLogins(recent.slice(0, 3)); // Show only last 3
  }, []);

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  const handleQuickLogin = (loginData) => {
    setNis(loginData.nis);
    setKelas(loginData.kelas);
    setJurusan(loginData.jurusan);
    // Scroll to token input
    setTimeout(() => {
      document.querySelector('.login-select')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogin = async () => {
    if (!nis || !kelas || !jurusan || !token) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Semua data wajib diisi",
      });
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", nis));
      if (!snap.exists()) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Data tidak ditemukan",
        });
        return;
      }

      const user = snap.data();

      if (
        user.kelas !== kelas ||
        user.jurusan !== jurusan ||
        user.token !== token
      ) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Data tidak cocok",
        });
        return;
      }

      // Cek apakah sudah voting
      if (user.sudahVote === true) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Kamu sudah voting",
        });
        return;
      }

      // Add to recent logins
      const loginData = { nis, kelas, jurusan, timestamp: new Date().toISOString() };
      const recent = JSON.parse(localStorage.getItem("recentLogins")) || [];
      const filtered = recent.filter(r => r.nis !== nis); // Remove if already exists
      const updated = [loginData, ...filtered].slice(0, 5); // Keep only 5 recent
      localStorage.setItem("recentLogins", JSON.stringify(updated));

      // Simpan user info di localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ nis, kelas, jurusan, nama: user.nama })
      );

      // Show loading popup
      setNotification({
        isOpen: true,
        type: "loading",
        message: "Loading...",
      });

      // Delay for animation effect
      setTimeout(() => {
        setNotification({
          isOpen: true,
          type: "success",
          message: "Login berhasil!",
        });

        // Redirect after animation
        setTimeout(() => {
          navigate("/simulasi");
        }, 1000);
      }, 1500);
    } catch (err) {
      console.error(err);
      setNotification({
        isOpen: true,
        type: "error",
        message: "Terjadi kesalahan",
      });
    }
  };

  return (
    <>
      <Navbar />
      <NotificationPopup
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
      />

      <section className="login-hero">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Kembali
        </button>

        <div className="login-hero-text">
          {/* <div className="badge">SAAT HARI</div> */}
          <h1>LoGin</h1>
          <p>isi sesuai format yap!</p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          {/* <h2>Yuk isi Data Kamu</h2> */}

          {recentLogins.length > 0 && (
            <div className="recent-logins">
              <p className="recent-label">Login Terakhir:</p>
              <div className="recent-list">
                {recentLogins.map((login, index) => (
                  <button
                    key={index}
                    className="recent-item"
                    onClick={() => handleQuickLogin(login)}
                    type="button"
                  >
                    <span className="recent-nis">{login.nis}</span>
                    <span className="recent-class">{login.kelas}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            placeholder="NIS"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
          />
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="login-select"
          >
            <option value="">Pilih Kelas</option>
            <option value="X">X</option>
            <option value="XI">XI</option>
            <option value="XII">XII</option>
          </select>
          <select
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            className="login-select"
          >
            <option value="">Pilih Jurusan</option>
            <option value="RPL">RPL</option>
            <option value="TKJ">TKJ</option>
            <option value="TEI">TEI</option>
            <option value="TBSM">TBSM</option>
            <option value="AKL">AKL</option>
            <option value="TET">TET</option>
          </select>
          <input
            type="password"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Masuk!
          </button>
        </div>
      </section>
    </>
  );
}

