import { Binary, ObjectId } from 'mongodb';
import Album from '../models/Album.js';
import { mongoClient } from '../config/Mongodb.js';

// Función helper para procesar la imagen
function processAlbumImage(album) {
  if (!album.cover_image?.data) return  '../public/placeholder.jpg'; 
  
  const base64 = album.cover_image.data.toString('base64');
  const contentType = album.cover_image.contentType || 'image/jpeg';
  return `data:${contentType};base64,${base64}`;
}

// Luego en tus controladores:
export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    const albumsWithImages = albums.map(album => ({
      ...album.toObject(),
      coverUrl: processAlbumImage(album)
    }));
    res.json(albumsWithImages);
  } catch (error) {
    console.error("Error al obtener los álbumes:", error);
    res.status(500).json({ error: "Error al obtener los álbumes" });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Álbum no encontrado" });
    
    res.json({
      ...album.toObject(),
      coverUrl: processAlbumImage(album)
    });
  } catch (error) {
    console.error("Error al obtener el álbum:", error);
    res.status(500).json({ error: "Error al obtener el álbum" });
  }
};

// Crear un nuevo album
export const createAlbum = async (req, res) => {
  try {
    const { title, artist_name, release_date, genre } = req.body;
    const songs = req.body['songs[]']; // 👈 importante: así accedes al arreglo
    console.log("Canciones recibidas:", songs);

    // Aquí podrías revisar si es undefined
    if (!songs) {
      return res.status(400).send("No se recibieron canciones");
    }

    // Validación de archivo
    if (!req.files || !req.files.cover_image) {
      console.log('Error enviando la portada');
      return res.status(400).send('No se envió la portada del álbum');
    }

    const file = req.files.cover_image;

    // Crear nuevo álbum con la imagen directamente en el documento
    const newAlbum = new Album({
      title,
      artist_name,
      release_date,
      genre,
      songs: Array.isArray(songs) ? songs : [songs], // en caso de solo una canción
      cover_image: {
        data: new Binary(file.data),
        contentType: file.mimetype,
        name: file.name,
        size: file.size
      }
    });

    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    console.error('Error al crear álbum:', error);
    res.status(500).json({ error: 'Error al crear el álbum' });
  }
};

// Actualizar un álbum
export const updateAlbum = async (req, res) => {
  try {
    const { title, artist_name, release_date, genre } = req.body;
    const songs = req.body['songs[]']; // Acceder al arreglo de canciones

    // Datos básicos del álbum para actualizar
    const updateData = {
      title,
      artist_name,
      release_date,
      genre,
      songs: Array.isArray(songs) ? songs : [songs] // Manejar caso de una sola canción
    };

    // Si hay una nueva imagen de portada
    if (req.files && req.files.cover_image) {
      const file = req.files.cover_image;

      // Añadir la imagen directamente al objeto de actualización
      updateData.cover_image = {
        data: new Binary(file.data),
        contentType: file.mimetype,
        name: file.name,
        size: file.size
      };
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Álbum no encontrado" });
    }

    res.json(updatedAlbum);
  } catch (error) {
    console.error('Error al actualizar álbum:', error);
    res.status(500).json({ error: "Error al actualizar el álbum" });
  }
};

// Eliminar un álbum
export const deleteAlbum = async (req, res) => {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
    if (!deletedAlbum) return res.status(404).json({ error: "Álbum no encontrado" });
    res.json({ message: "Álbum eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el álbum" });
  }
};