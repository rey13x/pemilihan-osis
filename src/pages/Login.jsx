import { useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/NotificationPopup";

export default function Login() {
  const navigate = useNavigate();

  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success"
  });

  const handleLogin = async () => {
    if (!nis || !kelas || !jurusan || !token) {
      setNotification({
        isOpen: true,
        message: "Akun kamu gak Terpilih!",
        type: "error"
      });
      return;
    }

    const snap = await getDoc(doc(db, "users", nis));
    if (!snap.exists()) {
      setNotification({
        isOpen: true,
        message: "Akun kamu gak Terpilih!",
        type: "error"
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
        message: "Akun kamu gak Terpilih!",
        type: "error"
      });
      return;
    }

    // Cek apakah sudah voting
    if (user.sudahVote === true) {
      setNotification({
        isOpen: true,
        message: "Akun kamu gak Terpilih!",
        type: "error"
      });
      return;
    }

    // Success
    setNotification({
      isOpen: true,
      message: "Akun kamu terpilih!",
      type: "success"
    });

    // Simpan NIS ke sessionStorage untuk dipakai di PilihPaslon
    sessionStorage.setItem("userNIS", nis);

    // Redirect setelah popup selesai
    setTimeout(() => {
      navigate("/pilih-paslon");
    }, 2500);
  };

  return (
    <>
      <NotificationPopup
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
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

          <input placeholder="NIS" onChange={e => setNis(e.target.value)} />
          <input placeholder="Kelas (XII)" onChange={e => setKelas(e.target.value)} />
          <input placeholder="Jurusan (RPL 2)" onChange={e => setJurusan(e.target.value)} />
          <input type="password" placeholder="Token" onChange={e => setToken(e.target.value)} />

          <button className="login-btn" onClick={handleLogin}>
            Masuk!
          </button>
        </div>
      </section>
    </>
  );
}
