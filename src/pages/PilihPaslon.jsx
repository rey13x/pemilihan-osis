import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/NotificationPopup";

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
  const navigate = useNavigate();
  const [selectedPaslon, setSelectedPaslon] = useState(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [userNIS, setUserNIS] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    // Ambil NIS dari sessionStorage (disimpan saat login)
    const nis = sessionStorage.getItem("userNIS");
    if (!nis) {
      setNotification({
        isOpen: true,
        message: "Session expired! Silakan login ulang",
        type: "error"
      });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    setUserNIS(nis);
  }, [navigate]);

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
    if (!selectedPaslon || !userNIS) return;

    try {
      const userRef = doc(db, "users", userNIS);
      await updateDoc(userRef, {
        sudahVote: true,
        pilihan: selectedPaslon,
      });
      
      setNotification({
        isOpen: true,
        message: "Suara kamu berhasil tercatat!",
        type: "success"
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      console.error("Error updating document: ", err);
      setNotification({
        isOpen: true,
        message: "Gagal menyimpan suara, coba lagi!",
        type: "error"
      });
    }
  };

  return (
    <>
      <NotificationPopup
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />
      
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
    </>
  );
};

export default PilihPaslon;
