import React, { useState, useEffect } from 'react';
import AlbumCard from './AlbumCard';
import AlbumForm from './AlbumForm';
import Modal from './Modal';
import { albumService } from '../api/axios';
import './styles.css';

const AlbumGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setIsLoading(true);
      const data = await albumService.obtenerTodos();
      setAlbums(data);
    } catch (error) {
      console.error('Error al cargar los álbumes:', error);
      alert('No se pudieron cargar los álbumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAlbum = () => {
    setEditingAlbum(null); // Null indica creación de nuevo álbum
    setIsModalOpen(true);
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este álbum?')) {
      try {
        await albumService.eliminar(id);
        // Eliminar el álbum directamente del estado
        setAlbums(albums.filter((album) => album._id !== id));
      } catch (error) {
        console.error('Error al eliminar el álbum:', error);
        alert('No se pudo eliminar el álbum');
      }
    }
  };

  const handleFormSubmit = async (albumData) => {
    try {
      if (editingAlbum) {
        // Actualizar álbum existente
        await albumService.actualizar(editingAlbum._id, albumData);
        // Actualizar el álbum directamente en el estado
        setAlbums(albums.map(album => 
          album._id === editingAlbum._id ? { ...album, ...albumData } : album
        ));
        alert('Álbum actualizado correctamente');
      } else {
        // Crear nuevo álbum
        const newAlbum = await albumService.crear(albumData);
        // Agregar el nuevo álbum directamente al estado
        setAlbums([...albums, newAlbum]);
        alert('Álbum creado correctamente');
      }
      setIsModalOpen(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error('Error al guardar el álbum:', error);
      alert('Error al guardar el álbum: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAlbum(null);
  };

  return (
    <div className="album-gallery-container">
      <div className="gallery-header">
        <h1>Colección de Álbumes</h1>
        <button className="new-album-btn" onClick={handleNewAlbum}>
          Nuevo Álbum
        </button>
      </div>

      {isLoading ? (
        <div className="loading-message">Cargando álbumes...</div>
      ) : albums.length === 0 ? (
        <div className="no-albums-message">
          No hay álbumes disponibles. ¡Añade uno nuevo!
        </div>
      ) : (
        <div className="album-gallery">
          {albums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              onEdit={handleEdit}
              onDelete={() => handleDelete(album._id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCancel}>
          <AlbumForm
            albumData={editingAlbum}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};

export default AlbumGallery;
