import { useState } from "react";
import { db } from "../firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";

const KandidatCard = ({ kandidat, onSelect, isSelected }) => {
  return (
    <div
      className={`kandidat-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(kandidat.id)}
    >
      <img src={kandidat.foto} alt={kandidat.name} />
      <div className="kandidat-info">
        <h3>{kandidat.name}</h3>
        <p>{kandidat.partai}</p>
      </div>
      {isSelected && <div className="bullet-point">•</div>}
    </div>
  );
};

const PilihPaslon = () => {
  const [selectedPaslon, setSelectedPaslon] = useState(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const kandidatList = [
    {
      id: "paslon1",
      name: "Anies & Cak Imin",
      foto: "/path/to/anies.jpg",
      partai: "Non-partai",
    },
    {
      id: "paslon2",
      name: "Prabowo & Gibran",
      foto: "/path/to/prabowo.jpg",
      partai: "Gerindra",
    },
    {
      id: "paslon3",
      name: "Ganjar & Mahfud",
      foto: "/path/to/ganjar.jpg",
      partai: "PDIP",
    },
  ];

  const handleSelectPaslon = (id) => {
    setSelectedPaslon(id);
    setIsButtonEnabled(true);
  };

  const handleVote = async () => {
    if (!selectedPaslon) return;

    try {
      const userRef = doc(db, "users", "userNIS"); // Ganti "userNIS" dengan NIS user yang valid
      await updateDoc(userRef, {
        sudahVote: true,
        vote: selectedPaslon,
      });
      alert("Vote berhasil!");
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };

  return (
    <div className="pilih-paslon-container">
      <h2>Pilih Paslon</h2>
      <div className="kandidat-cards">
        {kandidatList.map((kandidat) => (
          <KandidatCard
            key={kandidat.id}
            kandidat={kandidat}
            onSelect={handleSelectPaslon}
            isSelected={selectedPaslon === kandidat.id}
          />
        ))}
      </div>
      <button
        className={`pilih-btn ${isButtonEnabled ? "active" : "disabled"}`}
        onClick={handleVote}
        disabled={!isButtonEnabled}
      >
        PILIH!
      </button>
    </div>
  );
};

export default PilihPaslon;
