import React, { useState, useEffect } from 'react';
import { albumService } from '../api/axios'; // Asegúrate que la ruta es correcta
import AlbumCard from './AlbumCard';
import AlbumForm from './AlbumForm';
import './AlbumList.css'; // Necesitarás crear este archivo CSS

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  // Cargar álbumes al montar el componente
  useEffect(() => {
    loadAlbums();
  }, []);

  // Función para cargar los álbumes desde la API
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumService.obtenerTodos();
      setAlbums(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar álbumes:', err);
      setError('No se pudieron cargar los álbumes. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la creación de un nuevo álbum
  const handleCreateAlbum = () => {
    setCurrentAlbum(null); // Resetear el álbum actual (para modo creación)
    setShowForm(true);
  };

  // Función para manejar la edición de un álbum existente
  const handleEditAlbum = (album) => {
    setCurrentAlbum(album);
    setShowForm(true);
  };

  // Función para manejar la eliminación de un álbum
  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este álbum?')) {
      try {
        await albumService.eliminar(albumId);
        // Actualizar la lista local eliminando el álbum
        setAlbums(albums.filter(album => album._id !== albumId));
      } catch (err) {
        console.error('Error al eliminar el álbum:', err);
        alert('No se pudo eliminar el álbum. Por favor, intente de nuevo.');
      }
    }
  };

  // Función para manejar el envío del formulario (crear o editar)
  const handleSubmitForm = async (albumData) => {
    try {
      if (currentAlbum) {
        // Modo edición
        await albumService.actualizar(currentAlbum._id, albumData);
      } else {
        // Modo creación
        await albumService.crear(albumData);
      }
      
      // Recargar la lista para mostrar los cambios
      await loadAlbums();
      
      // Cerrar el formulario
      setShowForm(false);
      return true;
    } catch (err) {
      console.error('Error al guardar el álbum:', err);
      alert(err.message || 'Error al guardar el álbum');
      return false;
    }
  };

  // Función para cancelar el formulario
  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <div className="album-list-container">
      <div className="album-list-header">
        <h1>Mi Colección de Álbumes</h1>
        <button 
          className="create-album-btn" 
          onClick={handleCreateAlbum}
        >
          Nuevo Álbum
        </button>
      </div>

      {/* Mostrar mensaje de carga o error si es necesario */}
      {loading && <div className="loading-message">Cargando álbumes...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Formulario modal para crear/editar álbumes */}
      {showForm && (
        <AlbumForm
          albumData={currentAlbum}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      )}

      {/* Lista de álbumes */}
      {!loading && !error && (
        <div className="albums-grid">
          {albums.length === 0 ? (
            <div className="no-albums-message">
              No hay álbumes en tu colección. ¡Añade uno nuevo!
            </div>
          ) : (
            albums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
                onEdit={handleEditAlbum}
                onDelete={handleDeleteAlbum}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumList;