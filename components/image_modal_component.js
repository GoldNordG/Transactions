// Composant pour la modal d'affichage d'image
export default function ImageModal({ selectedImage, onClose }) {
  if (!selectedImage) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <iframe
          src={selectedImage}
          title="Document Google Drive"
          width="100%"
          height="100%"
        />
      </div>

      <style jsx>{`
        .image-modal {
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          position: relative;
          background-color: white;
          padding: 0;
          width: 90%;
          height: 90%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 15px;
          color: #333;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          z-index: 1010;
          background-color: white;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .close-button:hover {
          color: #000;
          background-color: #eee;
        }
      `}</style>
    </div>
  );
}