import express from 'express'

import {getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum} from "../controller/AlbumController.js"

const router = express.Router()


router.get('/albums', getAlbums)
router.get('/album/:id', getAlbumById)
router.post('/newalbum', createAlbum )
router.put('/album/:id', updateAlbum)
router.delete('/album/:id', deleteAlbum)

export {router}