import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function Simulasi() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle Camera Click
  const handleCameraClick = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser kamu tidak mendukung akses kamera. Gunakan browser modern seperti Chrome, Firefox, atau Edge.");
        return;
      }

      const constraints = { 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start 5 second countdown
      let count = 5;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        
        if (count === 0) {
          clearInterval(countdownInterval);
          capturePhoto(stream);
        }
      }, 1000);
    } catch (error) {
      setCameraActive(false);
      setCountdown(null);
      
      // Handle different error types
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        alert("❌ Izin kamera ditolak!\n\nUntuk menggunakan kamera:\n1. Klik ikon gembok di address bar\n2. Pilih 'Izinkan' untuk kamera\n3. Coba lagi\n\nAtau reset izin situs di pengaturan browser.\n\nJika masih tidak bisa, hubungi admin untuk setup HTTPS.");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        alert("❌ Kamera tidak ditemukan!\n\nPastikan:\n1. Kamera sudah terpasang\n2. Tidak ada aplikasi lain yang menggunakan kamera");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        alert("❌ Kamera sedang digunakan oleh aplikasi lain!\n\nTutup aplikasi lain yang menggunakan kamera terlebih dahulu.");
      } else if (error.name === "SecurityError") {
        alert("❌ Error keamanan!\n\nWebsite ini harus menggunakan HTTPS untuk akses kamera.\n\nHubungi admin untuk setup HTTPS atau gunakan localhost dengan flag khusus.");
      } else {
        alert("❌ Error akses kamera: " + error.name + " - " + error.message);
      }
    }
  };

  // Capture Photo
  const capturePhoto = async (stream) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Convert to blob and save
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `photo-${Date.now()}.png`, { type: "image/png" });
        
        try {
          // Save photo metadata to Firestore
          await addDoc(collection(db, "photos"), {
            userId: localStorage.getItem("currentUser"),
            timestamp: serverTimestamp(),
            photoName: file.name,
            photoData: await fileToBase64(file),
          });

          alert("✅ Foto berhasil disimpan!");
        } catch (error) {
          console.error("Error saving photo:", error);
          alert("❌ Error menyimpan foto: " + error.message);
        }

        // Stop camera and cleanup
        stream.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
        setCountdown(null);
      });
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("❌ Error mengambil foto: " + error.message);
      // Cleanup on error
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
      setCountdown(null);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current) return;

    // Animate hero title
    gsap.fromTo(
      ".simulasi-hero h1",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // Animate hero text
    gsap.fromTo(
      ".simulasi-hero p",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      }
    );

    // Animate card
    gsap.fromTo(
      ".simulasi-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "back.out",
      }
    );

    // Pulse animation on button
    gsap.to(".simulasi-start-btn", {
      boxShadow: [
        "0 0 0 0 rgba(191, 132, 29, 0.7)",
        "0 0 0 20px rgba(191, 132, 29, 0)",
      ],
      duration: 2,
      repeat: -1,
      ease: "power1.inOut",
    });
  }, []);

  const handleStartVoting = () => {
    // Navigate to pilih paslon page
    navigate("/pilih-paslon");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="simulasi-page" ref={containerRef}>
        {/* Hero Section */}
        <section className="simulasi-hero">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
            style={{ marginBottom: "20px" }}
          >
            ← Kembali
          </button>

          <h1>Sudah Siap Voting?</h1>
          <p>Berikut adalah langkah-langkah yang perlu kamu lakukan untuk berpartisipasi dalam pemilihan OSIS.</p>
        </section>

        {/* Info Card Section */}
        <section className="simulasi-content">
          <div className="simulasi-image-info-section">
            <div className="simulasi-card">
              <div className="simulasi-icon-group">
                <span className="simulasi-main-icon">😎</span>
                <button
                  className="simulasi-camera-btn"
                  onClick={handleCameraClick}
                  disabled={cameraActive}
                >
                  📸
                </button>
              </div>
              <h2>Mulai Voting</h2>
              <p>Klik tombol kamera untuk foto! atau lanjut mulai voting.</p>
              <button
                className="simulasi-start-btn"
                onClick={handleStartVoting}
                ref={buttonRef}
              >
                Mulai Voting
              </button>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="simulasi-steps-section">
          <h2>Langkah-Langkah Voting:</h2>
          <div className="simulasi-steps">
            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
            >
              <div className="step-number">1</div>
              <h3>Kenali Paslon</h3>
              <p>Pelajari visi, misi, dan program kerja setiap paslon OSIS</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="step-number">2</div>
              <h3>Pilih Paslon</h3>
              <p>Pilih paslon yang paling sesuai dengan visi dan impianmu</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">3</div>
              <h3>Konfirmasi Voting</h3>
              <p>Pastikan pilihan kamu dan tekan tombol Yakin!</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="step-number">4</div>
              <h3>Selesai!</h3>
              <p>Voting kamu berhasil disimpan. Terima kasih telah berpartisipasi!</p>
            </motion.div>
          </div>
        </section>

        {/* Camera Modal */}
        {cameraActive && (
          <div className="camera-modal">
            <div className="camera-container">
              <h3>Ambil Foto</h3>
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="countdown">{countdown}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
