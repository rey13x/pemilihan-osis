import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Voting() {
const handleVote = async (nis) => {
  const userRef = doc(db, "users", nis);
  
  try {
    // Update status sudahVote menjadi true setelah memilih
    await updateDoc(userRef, {
      sudahVote: true,
    });
    
    console.log("Status voting berhasil diperbarui");
    // Navigasi ke halaman sukses atau ke halaman selanjutnya
  } catch (err) {
    console.error("Gagal memperbarui status voting", err);
  }
};
}