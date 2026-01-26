import { motion } from "framer-motion";
import "./NotificationPopup.css";

export default function NotificationPopup({ isOpen, type, message, onClose }) {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isError = type === "error";
  const isLoading = type === "loading";

  return (
    <div className="notification-overlay" onClick={onClose}>
      <motion.div
        className="notification-popup"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* LOADING STATE */}
        {isLoading && (
          <div className="notification-content">
            <motion.div
              className="loading-text"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Sedang Memproses...
            </motion.div>
            <motion.div
              className="loading-dots"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {isSuccess && (
          <div className="notification-content">
            <motion.div
              className="success-checkmark"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              ✓
            </motion.div>
            <p>{message}</p>
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="notification-content">
            <div className="error-icon">⚠</div>
            <p>{message}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
