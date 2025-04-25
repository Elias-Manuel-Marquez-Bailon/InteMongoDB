import React, { useState, useEffect } from 'react';
import { albumService } from '../api/axios';
import AlbumForm from './AlbumForm';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const data = await albumService.obtenerTodos();
      setAlbums(data);
    } catch (error) {
      console.error('Error al obtener los álbumes:', error);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setShowForm(true);
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
      setShowForm(false);
      setEditingAlbum(null);
      fetchAlbums();
    } catch (error) {
      console.error('Error al guardar el álbum:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAlbum(null);
  };

  return (
    <div>
      <h1>Lista de Álbumes</h1>
      <button onClick={() => setShowForm(true)}>Nuevo Álbum</button>
      <ul>
        {albums.map((album) => (
          <li key={album._id}>
            <span>{album.title} - {album.artist_name}</span>
            <button onClick={() => handleEdit(album)}>Editar</button>
          </li>
        ))}
      </ul>

      {showForm && (
        <AlbumForm
          albumData={editingAlbum}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AlbumList;