import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Simulasi from "./pages/Simulasi";
import Voting from "./pages/Voting";
import VotingSuccess from "./pages/VotingSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import PilihPaslon from "./pages/PilihPaslon";
import AdvertisementPopup from "./components/AdvertisementPopup";
import Dashboard from "./pages/Dashboard";
import Obrolan from "./pages/Obrolan";
import PageTransition from "./components/PageTransition";
import LoadingPage from "./components/LoadingPage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pre-load images and data
    const preloadAssets = async () => {
      // Simulate loading time or actual asset preloading
      // 2 seconds for loading + 5 seconds idle/delay
      await new Promise(resolve => setTimeout(resolve, 7000));
      setIsLoading(false);
    };

    preloadAssets();
  }, []);

  if (isLoading) {
    return <LoadingPage onLoadingComplete={() => setIsLoading(false)} />;
  }
  return (
    <BrowserRouter>
      <PageTransition />
      <AdvertisementPopup />
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

        {/* ================= VOTING SUCCESS ================= */}
        <Route
          path="/voting-success"
          element={
            <ProtectedRoute>
              <VotingSuccess />
            </ProtectedRoute>
          }
        />

        {/* ================= OBROLAN (CHAT) ================= */}
        <Route
          path="/obrolan"
          element={
            <ProtectedRoute>
              <Obrolan />
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

        {/* ================= DASHBOARD (ADMIN ONLY) ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-login" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
