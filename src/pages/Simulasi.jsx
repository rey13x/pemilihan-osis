import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Simulasi = () => {
  const [nis, setNis] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [token, setToken] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate(); // Navigate untuk berpindah halaman

  // Handle submit untuk NIS, Jurusan, dan Token
  const handleSubmit = () => {
    if (nis && jurusan && token) {
      setShowSuccess(true); // Tampilkan popup sukses
      setTimeout(() => {
        navigate("/voting"); // Pindah ke halaman voting setelah 5 detik
      }, 5000);
    }
  };

  return (
    <div className="simulasi-section">
      <button onClick={() => navigate("/")}>← Info Paslon</button>
      <div className="simulasi-card">
        <div className="simulasi-text">
          <h2>Isi Data Kamu</h2>
          <input
            type="text"
            placeholder="Masukkan NIS"
            value={nis}
            onChange={(e) => setNis(e.target.value)}
          />
          <input
            type="text"
            placeholder="Masukkan Jurusan"
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
          />
          <input
            type="text"
            placeholder="Masukkan Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={handleSubmit}>Masuk</button>
        </div>
      </div>

      {/* Popup success setelah berhasil */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Yeay kamu terpilih!</h3>
            <div className="loading-line" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulasi;
