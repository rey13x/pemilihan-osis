import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function CameraGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch photos from Firestore
  useEffect(() => {
    const q = query(collection(db, "photos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoList = [];
      snapshot.forEach((doc) => {
        photoList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      // Sort by timestamp (newest first)
      photoList.sort((a, b) => {
        const timeA = a.timestamp?.toDate?.().getTime() || 0;
        const timeB = b.timestamp?.toDate?.().getTime() || 0;
        return timeB - timeA;
      });
      setPhotos(photoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Download single photo
  const downloadPhoto = (photo) => {
    const link = document.createElement("a");
    link.href = photo.photoData;
    link.download = photo.photoName || `foto-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all photos as zip (simplified - download as separate images)
  const downloadAllPhotos = () => {
    photos.forEach((photo) => {
      setTimeout(() => {
        downloadPhoto(photo);
      }, 200);
    });
  };

  // Delete photo
  const deletePhoto = async (photoId) => {
    if (window.confirm("Hapus foto ini?")) {
      try {
        await deleteDoc(doc(db, "photos", photoId));
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
  };

  return (
    <motion.div
      className="camera-gallery-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <div className="gallery-header">
        <h3>📸 Galeri Foto Voting</h3>
        <div className="gallery-actions">
          {photos.length > 0 && (
            <>
              <button className="btn-download-all" onClick={downloadAllPhotos}>
                📥 Download Semua ({photos.length})
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Memuat foto...</div>
      ) : photos.length === 0 ? (
        <div className="empty-state">Belum ada foto yang diambil</div>
      ) : (
        <div className="photos-grid">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="photo-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <img src={photo.photoData} alt="Voting photo from student" />
              <div className="photo-info">
                <div className="photo-date">
                  {photo.timestamp?.toDate?.().toLocaleString("id-ID") || "No date"}
                </div>
                <div className="photo-actions">
                  <button
                    className="btn-download"
                    onClick={() => downloadPhoto(photo)}
                    title="Download foto"
                  >
                    📥
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deletePhoto(photo.id)}
                    title="Hapus foto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
