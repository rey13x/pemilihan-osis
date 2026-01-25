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
  if (!nis || !kelas || !jurusan || !token) {
    setError("Semua data wajib diisi");
    return;
  }

  const snap = await getDoc(doc(db, "users", nis));
  if (!snap.exists()) {
    setError("Data tidak ditemukan");
    return;
  }

  const user = snap.data();

  if (
    user.kelas !== kelas ||
    user.jurusan !== jurusan ||
    user.token !== token
  ) {
    setError("Data tidak cocok");
    return;
  }

  // Cek apakah sudah voting
  if (user.sudahVote === true) {
    setError("Kamu sudah voting");
    return;
  }

  navigate("/simulasi");
};

  return (
    <>
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

          <input placeholder="NIS" onChange={e => setNis(e.target.value)} />
          <input placeholder="Kelas (XII)" onChange={e => setKelas(e.target.value)} />
          <input placeholder="Jurusan (RPL 2)" onChange={e => setJurusan(e.target.value)} />
          <input type="password" placeholder="Token" onChange={e => setToken(e.target.value)} />

          {error && <p className="error-text">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Masuk!
          </button>
        </div>
      </section>
    </>
  );
}
