import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Voting() {
  const [pilihan, setPilihan] = useState(null);
  const nav = useNavigate();

  const submit = async () => {
    const user = auth.currentUser;
    if (!user || !pilihan) return;

    await setDoc(doc(db, "votes", user.uid), {
      paslon: pilihan,
      waktu: new Date(),
    });

    await updateDoc(doc(db, "users", user.uid), {
      sudahVoting: true,
    });

    alert("Pilihan tersimpan");
    nav("/");
  };

  return (
    <div className="container">
      <button onClick={() => setPilihan(1)}>Paslon 1</button>
      <button onClick={() => setPilihan(2)}>Paslon 2</button>
      <button onClick={() => setPilihan(3)}>Paslon 3</button>
      <button onClick={submit} disabled={!pilihan}>
        Kirim
      </button>
    </div>
  );
}
