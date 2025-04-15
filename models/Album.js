import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist_name: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  cover_image: {
    type: String
  },
  genre: {
    type: String,
    required: true
  },
  songs: [{
    type: String  // Ahora es un arreglo de strings (nombres de las canciones)
  }]
}, { timestamps: true });

const Album = mongoose.model('Album', AlbumSchema);

export default Album;
