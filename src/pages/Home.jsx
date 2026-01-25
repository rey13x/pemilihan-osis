import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home = () => {
  const navigate = useNavigate(); // Inisialisasi navigate untuk berpindah halaman

  return (
    <div className="hero">
      <h1 className="hero-title">
        Saat Hari <span className="highlight">PEMILU</span>
      </h1>
      <p>Aku harus ngapain aja sih 🤔 ?</p>
      <button className="simulasi-btn" onClick={() => navigate("/simulasi")}>
        Gaskeun!
      </button>
    </div>
  );
};

export default Home;
