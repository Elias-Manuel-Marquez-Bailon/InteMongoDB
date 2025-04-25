import React, { useState } from 'react';
import Header from '../components/Header';
import AlbumGallery from '../components/AlbumGallery';
import Modal from '../components/Modal';
import AlbumForm from '../components/AlbumForm';
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
      <Header 
        onSearch={setSearchTerm} 
        onAddAlbum={() => setIsModalOpen(true)} 
      />
      
      <AlbumGallery albums={filteredAlbums} />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AlbumForm onSubmit={handleAddAlbum} />
      </Modal>
    </div>
  );
};

export default MusicCollection;