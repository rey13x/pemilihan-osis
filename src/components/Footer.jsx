export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-about">
          <h3>Tentang Web Ini</h3>
          <p>
            Website digital untuk memudahkan proses pemilihan OSIS SMKN 2 Kota Bekasi. 
            Kami menghadirkan solusi voting yang transparan, aman, dan terpercaya untuk 
            memastikan suara setiap siswa dihitung dengan adil dan hasil yang akurat.
          </p>
        </div>

        <div className="footer-section footer-contact">
          <h3>Hubungi Kami</h3>
          <div className="contact-item">
            <a 
              href="https://wa.me/6281319865384" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link whatsapp-link"
            >
              <span>+62 813 1986 5384</span>
            </a>
          </div>
          <div className="contact-item">
            <a 
              href="https://instagram.com/13bagas.exv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link instagram-link"
            >
              <span>@13bagas.exv</span>
            </a>
          </div>
          <div className="contact-item">
            <a 
              href="https://instagram.com/osis_smkn2bekasi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link instagram-link"
            >
              <span>@osis_smkn2bekasi</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
