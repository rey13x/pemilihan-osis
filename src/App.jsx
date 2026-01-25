import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Simulasi from "./pages/Simulasi";
import Voting from "./pages/Voting";
import ProtectedRoute from "./components/ProtectedRoute";
import PilihPaslon from "./pages/PilihPaslon"; // Import PilihPaslon.jsx

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= HOME / LANDING ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* ================= LOGIN (ONE PAGE ONLY) ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= SIMULASI (HALAMAN SENDIRI) ================= */}
        <Route path="/simulasi" element={<Simulasi />} />

        {/* ================= REGISTER ================= */}
        <Route path="/register" element={<Register />} />

        {/* ================= PILIH PASLON ================= */}
        <Route
          path="/pilih-paslon"
          element={
            <ProtectedRoute>
              <PilihPaslon /> {/* Halaman PilihPaslon */}
            </ProtectedRoute>
          }
        />

        {/* ================= VOTING (PROTECTED) ================= */}
        <Route
          path="/voting"
          element={
            <ProtectedRoute>
              <Voting />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
