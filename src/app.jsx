import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Simulasi from "./pages/Simulasi";
import VisiMisi from "./pages/VisiMisi";
import VisiMisiDetail from "./pages/VisiMisiDetail";
import Voting from "./pages/Voting";
import VotingSuccess from "./pages/VotingSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import PilihPaslon from "./pages/PilihPaslon";
import AdvertisementPopup from "./components/AdvertisementPopup";
import Dashboard from "./pages/Dashboard";
import Obrolan from "./pages/Obrolan";

import PageTransition from "./components/PageTransition";
import LoadingPage from "./components/LoadingPage";
import "./styles/Footer.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Pre-load all images and data with retry logic
    const preloadAssets = async () => {
      try {
        // List of all images to preload - with multiple attempts for reliability
        const imagesToLoad = [
          // Main assets
          require("./assets/illustration.png"),
          require("./assets/smk2.png"),
          
          // Paslon candidate images
          "/paslon/paslon-1.png",
          "/paslon/paslon-2.png",
          "/paslon/paslon-3.png",
          "/paslon/paslon-4.png",
          "/paslon/formal-osis.jpg",
          
          // Jurusan logos
          "/jurusan/RPL.png",
          "/jurusan/TKJ.png",
          "/jurusan/TEI.png",
          "/jurusan/TBSM.png",
          "/jurusan/AKL.png",
          "/jurusan/TET.png",
          
          // Info and other assets
          "/info/smk2.png",
          "/steps/step-1.png",
          "/steps/step-2.png",
          "/steps/step-3.png",
        ];

        // Function to load image with retry
        const loadImageWithRetry = (url, retries = 3) => {
          return new Promise((resolve, reject) => {
            let attempts = 0;

            const attemptLoad = () => {
              attempts++;
              const img = new Image();
              let timeoutId;

              img.onload = () => {
                clearTimeout(timeoutId);
                resolve(url);
              };

              img.onerror = () => {
                clearTimeout(timeoutId);
                if (attempts < retries) {
                  setTimeout(attemptLoad, 500); // Retry after 500ms
                } else {
                  console.warn(`Failed to load image after ${retries} attempts: ${url}`);
                  resolve(url); // Proceed anyway after retries
                }
              };

              // Set timeout for slow connections
              img.src = typeof url === "string" ? url : url;
              timeoutId = setTimeout(() => {
                if (!img.complete && attempts < retries) {
                  attemptLoad();
                }
              }, 5000); // 5 second timeout per attempt
            };

            attemptLoad();
          });
        };

        // Load all images with retry logic
        const loadPromises = imagesToLoad.map((url) =>
          loadImageWithRetry(url, 3)
        );

        // Wait for all images to load with a max timeout
        await Promise.all(loadPromises);

        // Minimum loading time for UX (8 seconds) - STRICTLY ENFORCED
        await new Promise((resolve) => setTimeout(resolve, 8000));
        
        // Small delay before hiding loading screen
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading assets:", error);
        // Still proceed after timeout
        setIsLoading(false);
      }
    };

    // Fallback timeout - ensure loading screen hides after max 15 seconds
    const fallbackTimeout = setTimeout(() => {
      console.warn("Loading timeout - forcing app to load");
      setIsLoading(false);
    }, 15000);

    preloadAssets().finally(() => clearTimeout(fallbackTimeout));
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

        {/* ================= VISI MISI ================= */}
        <Route path="/visi-misi" element={<VisiMisi />} />
        <Route path="/visi-misi/:nomor" element={<VisiMisiDetail />} />

        {/* ================= REGISTER ================= */}
        <Route path="/register" element={<Register />} />

        {/* ================= PILIH PASLON ================= */}
        <Route
          path="/pilih-paslon"
          element={
            <ProtectedRoute allowIfVoted={false}>
              <PilihPaslon /> {/* Halaman PilihPaslon - tidak bisa diakses setelah voting */}
            </ProtectedRoute>
          }
        />

        {/* ================= VOTING SUCCESS ================= */}
        <Route
          path="/voting-success"
          element={
            <ProtectedRoute allowIfVoted={true}>
              <VotingSuccess />
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

        {/* ================= OBROLAN (CHAT PAGE) ================= */}
        <Route path="/obrolan" element={<Obrolan />} />

        {/* ================= DASHBOARD (ADMIN ONLY) ================= */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-login" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
