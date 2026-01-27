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
          
          // Jurusan logos
          "/jurusan/rpl.png",
          "/jurusan/tkj.png",
          "/jurusan/tei.png",
          "/jurusan/tbsm.png",
          "/jurusan/akl.png",
          "/jurusan/tet.png",
        ];

        // Function to load image with retry
        const loadImageWithRetry = (url, retries = 3) => {
          return new Promise((resolve, reject) => {
            let attempts = 0;

            const attemptLoad = () => {
              attempts++;
              const img = new Image();

              img.onload = () => {
                resolve(url);
              };

              img.onerror = () => {
                if (attempts < retries) {
                  setTimeout(attemptLoad, 500); // Retry after 500ms
                } else {
                  resolve(url); // Proceed anyway after retries
                }
              };

              // Set timeout for slow connections
              img.src = typeof url === "string" ? url : url;
              setTimeout(() => {
                if (!img.complete && attempts < retries) {
                  attemptLoad();
                }
              }, 3000); // 3 second timeout per attempt
            };

            attemptLoad();
          });
        };

        // Load all images with retry logic
        const loadPromises = imagesToLoad.map((url) =>
          loadImageWithRetry(url, 3)
        );

        // Wait for all images to load with a max timeout
        const raceWithTimeout = Promise.race([
          Promise.all(loadPromises),
          new Promise((resolve) =>
            setTimeout(() => {
              console.warn("Asset loading timeout - proceeding anyway");
              resolve();
            }, 30000) // 30 second max timeout
          ),
        ]);

        await raceWithTimeout;

        // Minimum loading time for UX (7 seconds)
        await new Promise((resolve) => setTimeout(resolve, 7000));

        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading assets:", error);
        // Still proceed to home page even if some assets fail
        setIsLoading(false);
      }
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
