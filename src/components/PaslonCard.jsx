const PaslonCard = ({ id, onClick }) => {
  const paslons = [
    {
      name: "Anies & Cak Imin",
      description: "Indonesia Adil Makmur untuk Semua",
      image: "/images/anies-cak-imin.jpg",
    },
    {
      name: "Prabowo & Gibran",
      description: "Bersama Indonesia Maju Menuju Indonesia Emas 2045",
      image: "/images/prabowo-gibran.jpg",
    },
    {
      name: "Ganjar & Mahfud",
      description: "Gerak Cepat Menuju Indonesia Unggul",
      image: "/images/ganjar-mahfud.jpg",
    },
  ];

  const paslon = paslons[id - 1];

  return (
    <div className="paslon-card" onClick={onClick}>
      <img src={paslon.image} alt={paslon.name} />
      <h3>{paslon.name}</h3>
      <p>{paslon.description}</p>
    </div>
  );
};

export default PaslonCard;
