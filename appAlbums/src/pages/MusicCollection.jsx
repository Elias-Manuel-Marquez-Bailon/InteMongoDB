import React, { useState } from 'react';
import AlbumGallery from '../components/AlbumGallery';

//import '../styles/styles.css';

const MusicCollection = () => {
    const [albums, setAlbums] = useState([]);

  const handleAlbumCreated = (newAlbum) => {
    // Actualizar la lista de álbumes
    setAlbums([...albums, newAlbum]);
    // Puedes añadir notificación o redirección aquí
    console.log('Álbum creado con éxito:', newAlbum);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddAlbum = (newAlbum) => {
    setAlbums([...albums, newAlbum]);
    setIsModalOpen(false);
  };

  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      
      
      <AlbumGallery albums={filteredAlbums} />
      
      
    </div>
  );
};

export default MusicCollection;