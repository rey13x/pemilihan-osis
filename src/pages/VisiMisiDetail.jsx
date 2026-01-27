import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisiDetail() {
  const navigate = useNavigate();
  const { nomor } = useParams();
  const contentRef = useRef(null);

  // Full data for all paslon (so the correct foto is always used)
  const detailData = {
    "1": {
      nama: "Paslon 1",
      wakil: "Shandyka Dhavid & Virgina Zanuba Khafsoh",
      foto: "/paslon/paslon-1.png",
      visi: `Menjadikan OSIS SMKN 2 kota Bekasi sebagai organisasi yang kreatif, progresif,
dan dinamis, serta menjadi wadah untuk menyalurkan potensi dan ide kreatif
siswa/i SMKN 2 kota Bekasi`,
      misi: [
        `Mengutamakan nilai-nilai religius yang berlandaskan pada Ketuhanan
Yang Maha Esa dalam setiap aspek kegiatan.`,
        `Menjadi wadah aspirasi dan evaluasi siswa untuk membangun budaya
partisipatif di sekolah.`,
        `Menyelenggarakan program kerja edukatif yang kreatif dan inovatif untuk
meningkatkan pengetahuan, keterampilan, dan wawasan siswa.`,
        `Mengoptimalkan digitalisasi dalam sistem kerja organisasi dan penyebaran
informasi sekolah guna menciptakan pelayanan OSIS yang progresif,
cepat, dan transparan.`,
      ],
      proker: ["OSIS REAL TALK", "SMKN 2 START FEAST", "MYTERY COLLABORATION"],
      jargon: `PASLON 1!!\nSATU SUARA, SATU TUJUAN, BERSAMA 01, WUJUDKAN IMPIAN`,
    },
    "2": {
      nama: "Paslon 2",
      wakil: "Aulia Najibah & Reza Rizki Pratama",
      foto: "/paslon/paslon-2.png",
      visi: `Membangun lingkungan sekolah yang kolaboratif dan inklusif serta menetapkan
kedisiplinan yang berorientasi pada pengembangan karakter, dan mengembangkan
komunitas sekolah yang peduli dan kreatif`,
      misi: [
        `Membentuk karakter siswa/i SMKN 2 yang beriman, berakhlak mulia,
serta memiliki kesadaran moral dan spiritual.`,
        `Menyelenggarakan kegiatan yang kreatif, inovatif, dan bermanfaat bagi
siswa.`,
        `Menjalin komunikasi yang aktif baik kepada siswa/i maupun pihak
sekolah, dengan memanfaatkan kemajuan teknologi dan sumber daya
manusia.`,
      ],
      proker: [],
      jargon: `Satukan suara dukung paslon dua\nBe Wise, We Lead You\nJadilah agen perubahan bersama paslon dua\nPaslon dua siap taklukan dunia`,
    },
    "3": {
      nama: "Paslon 3",
      wakil: "Fitri Ramadhani & Reefly Aprilian",
      foto: "/paslon/paslon-3.png",
      visi: `Membentuk OSIS SMKN 2 Kota Bekasi yang dinamis, tertib, dan menjunjung
nilai kekeluargaan sebagai sarana pembinaan siswa/i yang konstruktif dan
berkesinambungan.`,
      misi: [
        `Menumbuhkan sikap tertib dan rasa tanggung jawab dalam setiap aktivitas
OSIS maupun kehidupan sekolah.`,
        `Mempererat rasa kebersamaan, solidaritas, dan sikap saling menghormati
antar pengurus OSIS dan seluruh warga sekolah.`,
        `Mengoptimalkan keterlibatan OSIS dalam menyusun serta menjalankan
kegiatan yang memberikan manfaat nyata bagi siswa/i.`,
        `Mendorong pengembangan minat, bakat, serta kreativitas siswa/i melalui
program kerja OSIS yang terarah dan berkelanjutan.`,
      ],
      proker: [],
      jargon: `tak banyak kata, tunjukkan aksi nyata, pilih nomor kosong tiga`,
    },
    "4": {
      nama: "Paslon 4",
      wakil: "Rahmat Alfian & Muhamad Yusuf",
      foto: "/paslon/paslon-4.png",
      visi: `Menjadikan OSIS SMK Negeri 2 Kota Bekasi sebagai organisasi yang aktif,
adaptif, dan berintegritas, serta mampu menumbuhkan kepemimpinan siswa
dalam mendukung budaya sekolah yang harmonis, tertib, dan berorientasi pada
pengembangan prestasi serta karakter.`,
      misi: [
        `Mengutamakan nilai keimanan, karakter dan akhlak mulia dalam program
kerja osis yang positif Dan berkelanjutan`,
        `Membentuk pengurus OSIS yang berintegritas, komunikatif, dan mampu
menjadi teladan, serta terbuka dalam menampung dan menyalurkan
aspirasi siswa.`,
        `Berperan aktif dalam menciptakan lingkungan sekolah yang bersih, tertib,
nyaman, serta disiplin dengan melibatkan Pengurus OSIS & Siswa/i`,
        `Mendorong dan Mengembangkan potensi siswa di bidang akademik dan
non akademik.`,
      ],
      proker: ["PKS (PEKAN KREATIVITAS SISWA)", "FESTIVAL ESTRAKULIKULER"],
      jargon: "",
    },
  };

  const data = detailData[nomor] || detailData["1"];

  // utility: split text content into spans per WORD for reveal (keeps spaces)
  function splitTextByWord(el) {
    if (!el) return;
    if (el.dataset.split === "true") return;
    const text = el.textContent.trim();
    const words = text.split(/(\s+)/); // keep spaces
    const frag = document.createDocumentFragment();
    words.forEach((w) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      frag.appendChild(span);
    });
    el.innerHTML = "";
    el.appendChild(frag);
    el.dataset.split = "true";
  }

  useEffect(() => {
    const root = contentRef.current;

    // create a pinned section similar to the example: pin the whole text area
    const textSection = root.querySelector("#textSection");
    if (textSection) {
      // split words inside the textSection
      const revealEls = textSection.querySelectorAll(
        ".visi-misi-detail-text, .visi-misi-detail-list li, .visi-misi-jargon"
      );

      revealEls.forEach((el) => {
        el.classList.add("reveal");
        splitTextByWord(el);
      });

      // pin the section and animate words opacity & y as user scrolls
      const words = textSection.querySelectorAll(".word");
      gsap.set(words, { y: 20, opacity: 0.3 });

      gsap.to(words, {
        y: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#textSection",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
          markers: false,
        },
      });
    }

    // subtle parallax from left for elements with .parallax-left
    gsap.utils.toArray(".parallax-left").forEach((el) => {
      gsap.to(el, {
        x: 30,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom center",
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
      <div className="visi-misi-detail-page" ref={contentRef}>
        {/* Back Button */}
        <button className="back-btn-detail" onClick={() => navigate("/visi-misi")}>← Kembali</button>

        {/* Hero Image */}
        <div className="visi-misi-detail-hero">
          <img src={data.foto} alt={data.nama} />
        </div>

        {/* Content */}
        <div className="visi-misi-detail-content">
          <h1 className="visi-misi-detail-section-title">VISI DAN MISI PASLON {nomor}</h1>

          {/* VISI */}
          <section className="visi-misi-section parallax-left">
            <h2 className="visi-misi-detail-text">VISI</h2>
            <p className="visi-misi-detail-text">{data.visi}</p>
          </section>

          {/* MISI */}
          <section className="visi-misi-section parallax-left">
            <h2 className="visi-misi-detail-text">MISI</h2>
            <ol className="visi-misi-detail-list">
              {data.misi.map((item, idx) => (
                <li key={idx} className="visi-misi-detail-text">{item}</li>
              ))}
            </ol>
          </section>

          {/* PROKER */}
          <section className="visi-misi-section parallax-left">
            <h2 className="visi-misi-detail-text">PROKER PASLON {nomor}</h2>
            <ol className="visi-misi-detail-list">
              {data.proker.map((item, idx) => (
                <li key={idx} className="visi-misi-detail-text">{item}</li>
              ))}
            </ol>
          </section>

          {/* JARGON */}
          <section className="visi-misi-section parallax-left">
            <h2 className="visi-misi-detail-text">JARGON PASLON {nomor}</h2>
            <p className="visi-misi-detail-text visi-misi-jargon">{data.jargon.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}</p>
          </section>

          {/* Download Button */}
          <section className="visi-misi-download-section">
            <a 
              href={`/vismis/vismis-${nomor}.pdf`} 
              download 
              className="visi-misi-download-btn"
            >
              📥 Download Visi & Misi
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
