import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisi() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const kandidatList = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Paslon 1",
      wakil: "Shandyka Dhavid & Virgina Zanuba Khafsoh",
      foto: "/paslon/paslon-1.png",
      tagline: "Satu Suara, Satu Tujuan",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Paslon 2",
      wakil: "Aulia Najibah & Reza Rizki Pratama",
      foto: "/paslon/paslon-2.png",
      tagline: "Be Wise, We Lead You",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Paslon 3",
      wakil: "Fitri Ramadhani & Reefly Aprilian",
      foto: "/paslon/paslon-3.png",
      tagline: "Aksi Nyata, Pilihan Tepat",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Paslon 4",
      wakil: "Rahmat Alfian & Muhamad Yusuf",
      foto: "/paslon/paslon-4.png",
      tagline: "Konsisten, Integral, Progresif",
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Text reveal animation for title
    gsap.to(".visi-misi-title", {
      scrollTrigger: {
        trigger: ".visi-misi-page",
        start: "top center",
        end: "top center",
        scrub: false,
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
    });

    // Staggered card reveal animation
    gsap.utils.toArray(".visi-misi-card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });

    // Parallax effect for images
    gsap.utils.toArray(".visi-misi-card-image").forEach((img) => {
      gsap.to(img, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="visi-misi-page" ref={containerRef}>
        {/* Hero Section */}
        <div className="visi-misi-hero">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="visi-misi-subtitle">Kenali Calon Pemimpin</p>
            <h1 className="visi-misi-title">Paslon OSIS 2026</h1>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="visi-misi-grid">
          {kandidatList.map((kandidat) => (
            <motion.div
              key={kandidat.id}
              className="visi-misi-card"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/visi-misi/${kandidat.nomor}`)}
            >
              <div className="visi-misi-card-image-wrapper">
                <img
                  src={kandidat.foto}
                  alt={kandidat.nama}
                  className="visi-misi-card-image"
                />
              </div>

              <div className="visi-misi-card-content">
                <div className="visi-misi-nomor">#{kandidat.nomor}</div>
                <h3 className="visi-misi-card-title">{kandidat.nama}</h3>
                <p className="visi-misi-card-wakil">{kandidat.wakil}</p>
                <p className="visi-misi-card-tagline">{kandidat.tagline}</p>

                <button className="visi-misi-card-btn">Lihat Detail →</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="visi-misi-footer">
          <p>Pilih calon pemimpin yang paling Anda percayai</p>
          <motion.button
            className="back-btn"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Kembali ke Beranda
          </motion.button>
        </div>
      </div>
    </>
  );
}
