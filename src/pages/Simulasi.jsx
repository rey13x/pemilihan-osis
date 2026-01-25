import { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (!nis || !kelas || !jurusan || !token) {
        setError("Semua data wajib diisi");
        return;
      }

      const userRef = doc(db, "users", nis);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Data tidak ditemukan");
        return;
      }

      const user = userSnap.data();

      if (
        user.kelas !== kelas ||
        user.jurusan !== jurusan ||
        user.token !== token
      ) {
        setError("Data tidak cocok");
        return;
      }

      if (user.sudahVote) {
        setError("Kamu sudah melakukan voting");
        return;
      }

      navigate("/simulasi");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan");
    }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="login-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Pemilu 101
        </button>

        <div className="login-hero-text">
          <div className="badge">SAAT HARI</div>
          <h1>PEMILU</h1>
          <p>
            Aku harus ngapain aja sih <span>🤔</span> ?
          </p>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className="login-form-section">
        <div className="login-card">
          <h2>Yuk isi Data Kamu</h2>

          <input
            type="text"
            placeholder="NIS"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
          />

          <input
            type="text"
            placeholder="Kelas (contoh: XII)"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          />

          <input
            type="text"
            placeholder="Jurusan (contoh: RPL 2)"
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
          />

          <input
            type="password"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Masuk!
          </button>
        </div>
      </section>
    </>
  );
}
