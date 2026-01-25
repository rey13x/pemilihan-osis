import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nis, setNis] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save the additional user data (NIS and Jurusan) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        nis: nis,
        jurusan: jurusan,
        email: email,
        sudahVoting: false, // initial voting status is false
      });

      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <input 
          type="text" 
          placeholder="NIS" 
          value={nis} 
          onChange={(e) => setNis(e.target.value)} 
          required
        />
        <input 
          type="text" 
          placeholder="Jurusan" 
          value={jurusan} 
          onChange={(e) => setJurusan(e.target.value)} 
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Membuat Akun.." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
