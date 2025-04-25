import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist_name: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  songs: {
    type: [String],
    required: true
  },
  cover_image: {
    data: Buffer,
    contentType: String,
    name: String,
    size: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Album = mongoose.model('Album', AlbumSchema);

export default Album;
