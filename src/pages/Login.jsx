import { useState } from "react";
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
  const [industri, setIndustri] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error",
    message: "",
  });

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  const validateInputs = () => {
    if (!nis || !nis.trim()) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "NIS tidak boleh kosong",
      });
      return false;
    }

    if (!kelas) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Pilih kelas terlebih dahulu",
      });
      return false;
    }

    if (!jurusan) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Pilih jurusan terlebih dahulu",
      });
      return false;
    }

    if (!industri) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Pilih industri terlebih dahulu",
      });
      return false;
    }

    if (!token || !token.trim()) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Token tidak boleh kosong",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const snap = await getDoc(doc(db, "users", nis.trim()));
      if (!snap.exists()) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Data tidak ditemukan",
        });
        setIsLoading(false);
        return;
      }

      const user = snap.data();

      if (
        user.kelas !== kelas ||
        user.jurusan !== jurusan ||
        user.industri !== industri ||
        user.token !== token.trim()
      ) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Data tidak cocok",
        });
        setIsLoading(false);
        return;
      }

      // Cek apakah sudah voting
      if (user.sudahVote === true) {
        setNotification({
          isOpen: true,
          type: "error",
          message: "Kamu sudah voting",
        });
        setIsLoading(false);
        return;
      }

      // Simpan user info di localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ nis: nis.trim(), kelas, jurusan, industri, nama: user.nama })
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
          message: "Yeay! Berhasil login",
        });

        // Redirect after animation
        setTimeout(() => {
          setIsLoading(false);
          navigate("/simulasi");
        }, 1000);
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setNotification({
        isOpen: true,
        type: "error",
        message: "Terjadi kesalahan. Coba lagi!",
      });
      setIsLoading(false);
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
        <button className="back-btn" onClick={() => navigate("/")} type="button">
          ← Kembali
        </button>

        <div className="login-hero-text">
          <h1>LoGin</h1>
          <p>isi sesuai format yap!</p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="NIS"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              disabled={isLoading}
              inputMode="numeric"
              maxLength="10"
            />
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="login-select"
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <option value="">Pilih Jurusan</option>
              <option value="RPL">RPL</option>
              <option value="TKJ">TKJ</option>
              <option value="TEI">TEI</option>
              <option value="TBSM">TBSM</option>
              <option value="AKL">AKL</option>
              <option value="TET">TET</option>
            </select>
            <select
              value={industri}
              onChange={(e) => setIndustri(e.target.value)}
              className="login-select"
              disabled={isLoading}
            >
              <option value="">Pilih Industri</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Services">Services</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="password"
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
              maxLength="20"
              autoComplete="off"
            />

            <button 
              className="login-btn" 
              type="submit"
              disabled={isLoading || !nis || !kelas || !jurusan || !industri || !token}
            >
              {isLoading ? "Loading..." : "Masuk!"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

