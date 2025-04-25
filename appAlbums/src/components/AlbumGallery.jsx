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

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await albumService.obtenerTodos();
      setAlbums(data);
    } catch (error) {
      console.error('Error al cargar los álbumes:', error);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (updatedAlbum) => {
    try {
      if (updatedAlbum._id) {
        // Actualizar álbum existente
        await albumService.actualizar(updatedAlbum._id, updatedAlbum);
      } else {
        // Crear nuevo álbum
        await albumService.crear(updatedAlbum);
      }
      setIsModalOpen(false);
      setEditingAlbum(null);
      fetchAlbums();
    } catch (error) {
      console.error('Error al guardar el álbum:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAlbum(null);
  };

  return (
    <div className="album-gallery">
      {albums.map((album) => (
        <AlbumCard
          key={album._id}
          album={album}
          onEdit={handleEdit}
          onDelete={async (id) => {
            await albumService.eliminar(id);
            fetchAlbums();
          }}
        />
      ))}

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