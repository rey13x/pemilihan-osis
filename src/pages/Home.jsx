import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import Popup from "../components/Popup";

export default function Home() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);

  const handleClick = async () => {
    const user = auth.currentUser;
    if (!user) return nav("/login");

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists() && snap.data().sudahVoting) {
      setShow(true);
    } else {
      nav("/voting");
    }
  };

  return (
    <div className="container">
      <button className="simulasi-btn" onClick={handleClick}>
        AYO PILIH OSIS
      </button>

      {show && (
        <Popup>
          <h3>Kamu sudah memilih</h3>
          <button onClick={() => setShow(false)}>Tutup</button>
        </Popup>
      )}
    </div>
  );
}
