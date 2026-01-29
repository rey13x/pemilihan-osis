import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
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
  const [userHasPhoto, setUserHasPhoto] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [stream, setStream] = useState(null);

  // Check authentication and existing photo
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Check if user already has a photo
      const checkExistingPhoto = async () => {
        try {
          const photosRef = collection(db, "photos");
          const q = query(photosRef, where("userId", "==", user));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            setUserHasPhoto(true);
          }
        } catch (error) {
          console.error("Error checking photos:", error);
        }
      };
      
      checkExistingPhoto();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Handle Camera Click
  const handleCameraClick = async () => {
    // Check if user already has a photo
    if (userHasPhoto) {
      alert("✓ Kamu sudah foto! Hanya bisa foto sekali");
      return;
    }
    
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser kamu tidak mendukung akses kamera. Gunakan browser modern seperti Chrome, Firefox, atau Edge.");
        return;
      }

      // Try with minimal constraints first
      let constraints = { 
        video: true,
        audio: false 
      };

      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted, stream tracks:", mediaStream.getTracks());
      
      setCameraActive(true);
      setStream(mediaStream);
      
      // Set video stream with proper error handling
      if (videoRef.current) {
        console.log("Setting srcObject to mediaStream");
        videoRef.current.srcObject = mediaStream;
        
        // Add onplay event listener
        const handlePlay = () => {
          console.log("Video element playing");
          videoRef.current?.removeEventListener("play", handlePlay);
        };
        videoRef.current.addEventListener("play", handlePlay);
        
        // Ensure video plays and displays stream
        const handleLoadedMetadata = () => {
          console.log("Video metadata loaded, video dimensions:", videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
          
          // Force play the video
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Video started playing successfully");
            }).catch((error) => {
              console.error("Play error:", error);
            });
          }
        };
        
        videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
        
        // Handle error if video element fails to load
        videoRef.current.onerror = (error) => {
          console.error("Video element error:", error);
          alert("Error menampilkan video kamera");
        };
      }
    } catch (error) {
      setCameraActive(false);
      setCountdown(null);
      setStream(null);
      console.error("Camera error:", error);
      alert("❌ Error mengakses kamera: " + error.message);
    }
  };

  // Capture Photo
  const capturePhoto = async (mediaStream) => {
    try {
      // Validate refs exist
      if (!videoRef.current || !canvasRef.current) {
        console.error("Video or canvas ref not available");
        throw new Error("Video atau canvas tidak tersedia");
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      console.log("Capturing photo, video dimensions:", video.videoWidth, "x", video.videoHeight);
      
      // Wait for video to have dimensions
      await new Promise((resolve, reject) => {
        let attempts = 0;
        const checkReady = () => {
          attempts++;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            console.log("Video ready for capture at attempt", attempts);
            resolve();
          } else if (attempts > 50) {
            reject(new Error("Video tidak siap dalam waktu yang ditentukan"));
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });

      // Small delay to ensure video frame is rendered
      await new Promise((resolve) => setTimeout(resolve, 200));

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Tidak bisa mendapatkan canvas context");
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Get data URL and show preview
      const dataUrl = canvas.toDataURL("image/png");
      console.log("Photo captured successfully");
      setPhotoDataUrl(dataUrl);
      setPhotoCaptured(true);
      
      // Stop video stream but keep it available
      setCountdown(null);
    } catch (error) {
      console.error("Error capturing photo:", error);
      alert("❌ Error mengambil foto: " + error.message);
      // Cleanup on error
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
      setCountdown(null);
    }
  };

  // Manual trigger photo with countdown
  const startPhotoCountdown = async () => {
    if (!stream) {
      alert("Stream tidak tersedia");
      return;
    }

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
  };

  // Save captured photo to Firestore
  const savePhoto = async () => {
    if (!photoDataUrl) return;
    
    try {
      // Save photo metadata to Firestore
      await addDoc(collection(db, "photos"), {
        userId: currentUser,
        timestamp: serverTimestamp(),
        photoName: `photo-${Date.now()}.png`,
        photoData: photoDataUrl,
      });

      alert("✅ Foto berhasil disimpan!");
      setUserHasPhoto(true);
      
      // Cleanup
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
      setPhotoCaptured(false);
      setPhotoDataUrl(null);
      setStream(null);
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("❌ Error menyimpan foto: " + error.message);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    if (!stream) {
      alert("Stream tidak tersedia");
      return;
    }
    
    setPhotoCaptured(false);
    setPhotoDataUrl(null);
    setCountdown(null);
  };

  // Cancel camera
  const cancelCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    setPhotoCaptured(false);
    setPhotoDataUrl(null);
    setCountdown(null);
    setStream(null);
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
              <h2>Mau Ciss?</h2>
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
            <div className="camera-notification">📷 Kamera Aktif</div>
            <div className="camera-container">
              {!photoCaptured ? (
                <>
                  <h3>Ambil Foto</h3>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="camera-video"
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  
                  {countdown !== null ? (
                    <>
                      <div className="camera-countdown">{countdown}</div>
                      <div style={{ color: "white", fontSize: "16px", marginTop: "20px", fontWeight: "600" }}>Siap Bergaya!!</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: "white", fontSize: "16px", marginTop: "20px", fontWeight: "600" }}>Posisikan kamera dengan baik 😊</div>
                      <button onClick={startPhotoCountdown} className="camera-capture-btn">📸 Ambil Foto</button>
                    </>
                  )}
                  
                  <button onClick={cancelCamera} className="camera-cancel-btn">Batal</button>
                </>
              ) : (
                <>
                  <h3>Preview Foto</h3>
                  <img src={photoDataUrl} alt="captured" className="camera-preview" style={{ width: "100%", borderRadius: "8px" }} />
                  <div className="camera-actions">
                    <button onClick={savePhoto} className="camera-save-btn">✓ Simpan Foto</button>
                    <button onClick={retakePhoto} className="camera-retake-btn">↻ Ambil Ulang</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
