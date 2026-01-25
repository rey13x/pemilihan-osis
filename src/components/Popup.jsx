export default function Popup({ children }) {
  return (
    <div style={{ background: "#0008", padding: 40 }}>
      <div style={{ background: "#fff", padding: 20 }}>
        {children}
      </div>
    </div>
  );
}
