import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Voting = () => {
  const [selectedPaslon, setSelectedPaslon] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (paslon) => {
    setSelectedPaslon(paslon);
  };

  const handleConfirm = () => {
    alert("Pastikan ini Pilihanmu!"); // Mengonfirmasi pilihan
    setTimeout(() => {
      alert("Yeay Pilihanmu Tersimpan!");
      setTimeout(() => {
        navigate("/"); // Kembali ke halaman utama setelah 5 detik
      }, 5000);
    }, 1000);
  };

  return (
    <div>
      <h1>Pilih Paslon</h1>
      <div>
        <button onClick={() => handleSelect("Anies & Cak Imin")}>Anies & Cak Imin</button>
        <button onClick={() => handleSelect("Prabowo & Gibran")}>Prabowo & Gibran</button>
        <button onClick={() => handleSelect("Ganjar & Mahfud")}>Ganjar & Mahfud</button>
      </div>
      <button 
        disabled={!selectedPaslon}
        onClick={handleConfirm}
        style={{ backgroundColor: selectedPaslon ? "green" : "gray" }}
      >
        Pilih
      </button>
    </div>
  );
};

export default Voting;
