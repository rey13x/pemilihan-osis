import { db } from "../firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export const addTestVotingData = async () => {
  try {
    const usersRef = collection(db, "users");

    // Test data: mix of votes across different jurusans
    const testData = [
      {
        nis: "test001",
        kelas: "XII",
        jurusan: "AKL",
        sudahVote: true,
        vote: "paslon1",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test002",
        kelas: "XII",
        jurusan: "AKL",
        sudahVote: true,
        vote: "paslon2",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test003",
        kelas: "XII",
        jurusan: "AKL",
        sudahVote: true,
        vote: "paslon1",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test004",
        kelas: "XII",
        jurusan: "RPL",
        sudahVote: true,
        vote: "paslon2",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test005",
        kelas: "XII",
        jurusan: "RPL",
        sudahVote: true,
        vote: "paslon2",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test006",
        kelas: "XII",
        jurusan: "RPL",
        sudahVote: true,
        vote: "paslon3",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test007",
        kelas: "XII",
        jurusan: "TKJ",
        sudahVote: true,
        vote: "paslon1",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test008",
        kelas: "XII",
        jurusan: "TKJ",
        sudahVote: true,
        vote: "paslon3",
        votedAt: new Date(),
        token: "test123",
      },
      {
        nis: "test009",
        kelas: "XII",
        jurusan: "TKJ",
        sudahVote: true,
        vote: "paslon3",
        votedAt: new Date(),
        token: "test123",
      },
    ];

    console.log("Adding test voting data...");

    for (const data of testData) {
      await setDoc(doc(usersRef, data.nis), data);
      console.log(`✓ Added vote from ${data.nis} for ${data.vote} (${data.jurusan})`);
    }

    console.log("✓ Test data added successfully!");
    alert("✓ Test voting data added! Dashboard should now show results.");
  } catch (error) {
    console.error("Error adding test data:", error);
    alert("Error adding test data: " + error.message);
  }
};
