import React, { useState, useEffect } from 'react';
import './AlbumForm.css';

const AlbumForm = ({ albumData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    genre: '',
    release_date: '',
    coverFile: null,
    songs: [''],
  });

  const [coverPreview, setCoverPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (albumData) {
      // Formatear la fecha al formato YYYY-MM-DD esperado por el input de tipo date
      let formattedDate = '';
      if (albumData.release_date) {
        const date = new Date(albumData.release_date);
        formattedDate = date.toISOString().split('T')[0];
      }

      setFormData({
        title: albumData.title || '',
        artist_name: albumData.artist_name || '',
        genre: albumData.genre || '',
        release_date: formattedDate,
        coverFile: null,
        songs: albumData.songs && albumData.songs.length > 0 ? [...albumData.songs] : [''],
      });

      if (albumData.coverUrl) {
        setCoverPreview(albumData.coverUrl);
      }
    }
  }, [albumData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSongChange = (index, value) => {
    const newSongs = [...formData.songs];
    newSongs[index] = value;
    setFormData((prev) => ({ ...prev, songs: newSongs }));
  };

  const handleAddSong = () => {
    setFormData((prev) => ({ ...prev, songs: [...prev.songs, ''] }));
  };

  const handleRemoveSong = (index) => {
    // No permitir eliminar la última canción
    if (formData.songs.length <= 1) return;
    
    const newSongs = formData.songs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, songs: newSongs }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.');
        return;
      }
      setFormData((prev) => ({ ...prev, coverFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 // En el handleSubmit de AlbumForm:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Validar que al menos haya una canción no vacía
    const validSongs = formData.songs.filter((song) => song.trim() !== '');
    if (validSongs.length === 0) {
      alert('Debe agregar al menos una canción.');
      setIsSubmitting(false);
      return;
    }

    // Preparar los datos para enviar
    const albumDataToSend = {
      title: formData.title,
      artist_name: formData.artist_name,
      release_date: formData.release_date,
      genre: formData.genre,
      songs: validSongs,
      // Usar coverFile si está disponible, de lo contrario usar la URL existente
      cover_image: formData.coverFile || (albumData?.coverUrl || null),
    };

    // Si estamos editando, mantener el ID del álbum
    if (albumData?._id) {
      albumDataToSend._id = albumData._id;
    }

    // Llamar a la función onSubmit y esperar su resultado
    const success = await onSubmit(albumDataToSend);
    
    if (success) {
      // Si fue exitoso, el componente padre ya habrá cerrado el formulario
      console.log('Álbum guardado correctamente');
    }
  } catch (error) {
    console.error('Error al guardar álbum:', error);
    alert('No se pudo guardar el álbum: ' + (error.message || 'Error desconocido'));
  } finally {
    setIsSubmitting(false);
  }
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
                  {formData.songs.length > 1 && (
                    <button
                      type="button"
                      className="removeSongBtn"
                      onClick={() => handleRemoveSong(index)}
                    >
                      ×
                    </button>
                  )}
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
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : (albumData ? 'Guardar cambios' : 'Crear álbum')}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
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