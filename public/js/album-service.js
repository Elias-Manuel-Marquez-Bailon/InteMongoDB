/**
 * Album Service
 * Handles album data operations
 */
class AlbumService {
    constructor() {
      // Sample album data (replace with API calls in production)
      this.albums = [
        {
          id: 1,
          title: 'After Hours',
          artist_name: 'The Weeknd',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2020-03-20',
          genre: 'R&B/Pop'
        },
        {
          id: 2,
          title: 'Future Nostalgia',
          artist_name: 'Dua Lipa',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2020-03-27',
          genre: 'Pop'
        },
        {
          id: 3,
          title: 'DAMN.',
          artist_name: 'Kendrick Lamar',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2017-04-14',
          genre: 'Hip-Hop'
        },
        {
          id: 4,
          title: 'When We All Fall Asleep, Where Do We Go?',
          artist_name: 'Billie Eilish',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2019-03-29',
          genre: 'Pop/Electropop'
        },
        {
          id: 5,
          title: 'Fine Line',
          artist_name: 'Harry Styles',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2019-12-13',
          genre: 'Pop Rock'
        },
        {
          id: 6,
          title: 'Chromatica',
          artist_name: 'Lady Gaga',
          cover_image: 'https://via.placeholder.com/300',
          release_date: '2020-05-29',
          genre: 'Dance-Pop'
        }
      ];
    }
  
    /**
     * Get all albums
     * @returns {Array} Array of album objects
     */
    getAllAlbums() {
      return this.albums;
    }
  
    /**
     * Search albums by title or artist
     * @param {string} searchTerm - Search term
     * @returns {Array} Filtered array of album objects
     */
    searchAlbums(searchTerm) {
      if (!searchTerm || searchTerm.trim() === '') {
        return this.albums;
      }
      
      const term = searchTerm.toLowerCase();
      return this.albums.filter(album => 
        album.title.toLowerCase().includes(term) || 
        album.artist_name.toLowerCase().includes(term)
      );
    }
  
    /**
     * Add a new album
     * @param {Object} albumData - Album data
     * @returns {Object} Created album
     */
    async addAlbum(albumData) {
      try {
        // In a real app, you would make an API call here
        // const response = await fetch('/newalbum', {
        //   method: 'POST',
        //   body: albumData
        // });
        
        // For demo, just add to local array
        const newAlbum = {
          id: this.albums.length + 1,
          title: albumData.get('title'),
          artist_name: albumData.get('artist_name'),
          cover_image: URL.createObjectURL(albumData.get('cover_image')),
          release_date: albumData.get('release_date'),
          genre: albumData.get('genre')
        };
        
        this.albums.unshift(newAlbum);
        return newAlbum;
      } catch (error) {
        console.error('Error adding album:', error);
        throw new Error('Failed to add album');
      }
    }
  
    /**
     * Update an existing album
     * @param {number} id - Album ID
     * @param {Object} albumData - Updated album data
     * @returns {Object} Updated album
     */
    async updateAlbum(id, albumData) {
      try {
        // In a real app, you would make an API call here
        // const response = await fetch(`/album/${id}`, {
        //   method: 'PUT',
        //   body: albumData
        // });
        
        // For demo, just update local array
        const index = this.albums.findIndex(album => album.id === id);
        if (index !== -1) {
          this.albums[index] = {
            ...this.albums[index],
            title: albumData.get('title'),
            artist_name: albumData.get('artist_name'),
            release_date: albumData.get('release_date'),
            genre: albumData.get('genre')
          };
          
          if (albumData.get('cover_image')?.size > 0) {
            this.albums[index].cover_image = URL.createObjectURL(albumData.get('cover_image'));
          }
          
          return this.albums[index];
        }
        
        throw new Error('Album not found');
      } catch (error) {
        console.error('Error updating album:', error);
        throw new Error('Failed to update album');
      }
    }
  
    /**
     * Delete an album
     * @param {number} id - Album ID
     * @returns {boolean} Success status
     */
    async deleteAlbum(id) {
      try {
        // In a real app, you would make an API call here
        // const response = await fetch(`/album/${id}`, {
        //   method: 'DELETE'
        // });
        
        // For demo, just remove from local array
        this.albums = this.albums.filter(album => album.id !== id);
        return true;
      } catch (error) {
        console.error('Error deleting album:', error);
        throw new Error('Failed to delete album');
      }
    }
  
    /**
     * Get album by ID
     * @param {number} id - Album ID
     * @returns {Object|null} Album object or null if not found
     */
    getAlbumById(id) {
      return this.albums.find(album => album.id === id) || null;
    }
  }
  
  // Create global instance
  const albumService = new AlbumService();