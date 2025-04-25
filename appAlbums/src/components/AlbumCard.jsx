import React, { useState, useRef } from 'react';
import './AlbumCard.css';

const AlbumCard = ({ album, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Verificar si cover_url existe y es válida
  const hasCoverImage = album.coverUrl && 
                       (album.coverUrl.startsWith('data:image') || 
                        album.coverUrl.startsWith('http'));

  return (
    <div className="album-card">
      {/* Menú de opciones (3 puntos) */}
      <div className="album-menu-container" ref={menuRef}>
        <button 
          className="album-menu-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Album options"
        >
          <div className="album-menu-dot"></div>
          <div className="album-menu-dot"></div>
          <div className="album-menu-dot"></div>
        </button>

        {showMenu && (
          <div className="album-dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => {
                onEdit(album); // Llama a la función de edición
                setShowMenu(false);
              }}
            >
              Editar
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                onDelete(album._id); // Llama a la función de eliminación
                setShowMenu(false);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Contenido del álbum */}
      <div className="album-cover">
        {hasCoverImage ? (
          <img 
            src={album.coverUrl} 
            alt={`Portada de ${album.title}`} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.parentElement.innerHTML = '<div class="default-cover">🎵</div>';
            }}
          />
        ) : (
          <div className="default-cover">🎵</div>
        )}
      </div>
      
      <div className="album-info">
        <h3>{album.title}</h3>
        <p className="artist">{album.artist_name}</p>
        <p className="details">
          {album.genre} • {new Date(album.release_date).toLocaleDateString()}
        </p>
        {album.songs?.length > 0 && (
          <div className="songs-list">
            <h4>Canciones:</h4>
            <ul>
              {album.songs.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;