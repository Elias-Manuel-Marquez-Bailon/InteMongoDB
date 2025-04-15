import Album from "../models/Album.js";


// Obtener todos los álbumes
export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los álbumes" });
  }
};

// Obtener un álbum por ID
export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Álbum no encontrado" });
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el álbum" });
  }
};

// Crear un nuevo álbum
export const createAlbum = async (req, res) => {
  try {
    const { title, artist_name, release_date, genre, songs } = req.body;
    let cover_image = "";

    /*// Si se sube una imagen de portada
    if (req.file) {
      cover_image = await s3(req.file);
    }*/

    // Crear un nuevo álbum c
    const newAlbum = new Album({
      title,
      artist_name,
      release_date,
      cover_image,
      genre,
      songs,  // 'songs' es un arreglo de strings 
    });

    // Guardar el nuevo álbum
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el álbum" });
  }
};


// Actualizar un álbum
export const updateAlbum = async (req, res) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAlbum) return res.status(404).json({ error: "Álbum no encontrado" });
    res.json(updatedAlbum);
  } catch (error) {
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


