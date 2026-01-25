export default function ProgressPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="progress-overlay" onClick={onClose}>
      <div className="progress-popup" onClick={(e) => e.stopPropagation()}>
        <h2>Sabar.. masih on progress</h2>
        <button className="progress-button" onClick={onClose}>
          Oke bang
        </button>
      </div>
    </div>
  );
}
