import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Album from '../models/Album.js';


import {getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum} from "../controller/AlbumController.js"

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/', async (req, res) => {
  try {
    const albums = await Album.find();

    // Cargar el HTML y reemplazar dinámicamente los datos
    fs.readFile(path.join(__dirname, '../public/views/index.html'), 'utf8', (err, html) => {
      if (err) {
        return res.status(500).send('Error al cargar la vista');
      }

      const albumHTML = albums.map(album => `
        <div class="album">
          <h3>${album.title}</h3>
          <p>Artista: ${album.artist_name}</p>
          <p>Género: ${album.genre}</p>
          <p>Fecha: ${new Date(album.release_date).toLocaleDateString()}</p>
        </div>
      `).join('');

      const finalHtml = html.replace('<!-- Aquí van los álbumes -->', albumHTML);
      res.send(finalHtml);
    });

  } catch (error) {
    res.status(500).send('Error al cargar álbumes');
  }
});


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
   //res.sendFile('../views/login.html');
});

router.get('/albums', getAlbums);
//router.get('/cover/:id', getCover);
router.get('/album/:id', getAlbumById);
router.post('/newalbum', createAlbum);
router.put('/album/:id', updateAlbum);
router.delete('/album/:id', deleteAlbum);



export default router;