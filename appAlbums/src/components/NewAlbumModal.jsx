import React from 'react';
//import './NewAlbumModal.css'; // Opcional: para estilos

export default function NewAlbumModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Nuevo Álbum</h2>
        <form /* aquí va tu lógica del form */>
          {/* ...inputs para título, artista, etc... */}
          <input type="text" name="title" placeholder="Título del álbum" required />
          {/* ...agrega más campos como necesites... */}
          <button type="submit">Crear Álbum</button>
        </form>
      </div>
    </div>
  );
}
