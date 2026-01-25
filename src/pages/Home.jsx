import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* STEPS */}
      <div className="steps-section container">
        <div className="steps-wrapper">
          <h2 className="steps-top">3 Cara Kamu</h2>
          <div className="steps-bottom">Pilih OSIS</div>
        </div>
      </div>

      <div className="steps-card-section container">
        <div className="steps-card-grid">
          <div className="steps-card">
            <div className="steps-number">1</div>
            <img src="/steps/step-1.png" className="steps-image" />
            <h3>Kenali Paslon</h3>
            <p>Cermati visi, misi, dan program kerja Paslon OSIS.</p>
          </div>

          <div className="steps-card">
            <div className="steps-number">2</div>
            <img src="/steps/step-2.png" className="steps-image" />
            <h3>Pilih OSIS</h3>
            <p>Gunakan akses NIS kamu untuk memilih.</p>
          </div>

          <div className="steps-card">
            <div className="steps-number">3</div>
            <img src="/steps/step-3.png" className="steps-image" />
            <h3>Terpilih</h3>
            <p>Pilihanmu tersimpan hingga pengumuman.</p>
          </div>
        </div>
      </div>

      {/* SIMULASI CTA */}
      <div className="simulasi-section container">
        <div className="simulasi-card">
          <div className="simulasi-text">
            <h2>
              TENTUKAN <br /> PILIHANMU!
            </h2>
            <button
              className="simulasi-btn"
              onClick={() => navigate("/login")}
            >
              Gaskeun!
            </button>
          </div>

          <div className="simulasi-image-single">
            <img src="/simulasi/foto-2.png" />
          </div>
        </div>
      </div>
    </>
  );
}
