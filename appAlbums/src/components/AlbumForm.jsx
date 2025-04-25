import React, { useState, useEffect } from 'react';
import './AlbumForm.css';

const AlbumForm = ({ albumData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    genre: '',
    release_date: '',
    coverUrl: '',
    songs: []
  });
  const [coverPreview, setCoverPreview] = useState('');

  // Precargar datos si estamos editando
  useEffect(() => {
    if (albumData) {
      setFormData({
        title: albumData.title || '',
        artist_name: albumData.artist_name || '',
        genre: albumData.genre || '',
        release_date: albumData.release_date ? 
          new Date(albumData.release_date).toISOString().split('T')[0] : '',
        coverUrl: albumData.coverUrl || '',
        songs: albumData.songs ? [...albumData.songs] : []
      });
      
      if (albumData.coverUrl) {
        setCoverPreview(albumData.coverUrl);
      }
    }
  }, [albumData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSongChange = (index, value) => {
    const newSongs = [...formData.songs];
    newSongs[index] = value;
    setFormData(prev => ({ ...prev, songs: newSongs }));
  };

  const handleAddSong = () => {
    setFormData(prev => ({ ...prev, songs: [...prev.songs, ''] }));
  };

  const handleRemoveSong = (index) => {
    const newSongs = formData.songs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, songs: newSongs }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        alert('El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setFormData(prev => ({ ...prev, coverUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      _id: albumData?._id // Mantenemos el ID si estamos editando
    });
  };

  return (
    <div className="form-modal">
      <div className="form-container">
        <h2>{albumData ? 'Editar Álbum' : 'Nuevo Álbum'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Artista</label>
            <input
              type="text"
              name="artist_name"
              value={formData.artist_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Género</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de lanzamiento</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Portada</label>
            <div 
              className={`file-upload ${coverPreview ? 'has-preview' : ''}`}
              onClick={() => document.getElementById('coverImageInput').click()}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Vista previa" id="coverPreview" />
              ) : (
                <>
                  <div className="file-upload-icon">+</div>
                  <div className="file-upload-text">Haz clic para subir una imagen</div>
                </>
              )}
            </div>
            <input
              type="file"
              id="coverImageInput"
              accept="image/*"
              onChange={handleCoverChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Canciones</label>
            <div className="songs-container">
              {formData.songs.map((song, index) => (
                <div key={index} className="song-input">
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => handleSongChange(index, e.target.value)}
                    placeholder={`Canción ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className="removeSongBtn"
                    onClick={() => handleRemoveSong(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                id="addSongBtn"
                onClick={handleAddSong}
              >
                Añadir canción
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {albumData ? 'Guardar cambios' : 'Crear álbum'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlbumForm;