import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  // No establecer Content-Type por defecto para permitir que Axios lo maneje automáticamente
});

// Interceptor para transformar FormData antes del envío
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Configuración específica para FormData
    config.headers['Content-Type'] = 'multipart/form-data';
    
    
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.error('Error de API:', error.response.data);
      return Promise.reject({
        message: error.response.data.message || 'Error en la solicitud',
        status: error.response.status,
        data: error.response.data
      });
    }
    console.error('Error de conexión:', error.message);
    return Promise.reject(error);
  }
);

export const albumService = {
  obtenerTodos: () => api.get('/albums'),
  obtenerPorId: (id) => api.get(`/album/${id}`),
  
  crear: async (albumData) => {
    try {
      const formData = new FormData();
  
      formData.append('title', albumData.title);
      formData.append('artist_name', albumData.artist_name);
      formData.append('release_date', albumData.release_date);
      formData.append('genre', albumData.genre);
  
      // Validar y agregar canciones como un arreglo
    if (albumData.songs && Array.isArray(albumData.songs)) {
        const validSongs = albumData.songs.filter(song => song.trim() !== ''); // Filtrar canciones vacías
        if (validSongs.length === 0) {
          throw new Error('Debe agregar al menos una canción');
        }
        validSongs.forEach(song => {
          formData.append('songs[]', song); // Enviar como 'songs[]' para que el backend lo interprete como un arreglo
        });
      } else {
        throw new Error('Las canciones deben ser un arreglo');
      }
  
      // Imagen
      if (albumData.cover_image instanceof File) {
        formData.append('cover_image', albumData.cover_image);
      } else if (typeof albumData.cover_image === 'string') {
        const blob = await fetch(albumData.cover_image).then(r => r.blob());
        formData.append('cover_image', blob, 'cover.jpg');
      }
  
       // Realizar la petición POST
    const result = await api.post('/newalbum', formData);
    console.log('Álbum creado:', result);
    return result;
    } catch (error) {
      console.error('Error al crear álbum:', error);
      throw error;
    }
  },  
  
  actualizar: (id, albumData) => {
    if (albumData.cover_image instanceof File || typeof albumData.cover_image === 'string') {
      return albumService.crear(albumData).then(() => {
        return api.put(`/album/${id}`, {
          ...albumData,
          cover_image: undefined // Ya se envió en la creación
        });
      });
    }
    return api.put(`/album/${id}`, albumData);
  },
  
  eliminar: (id) => api.delete(`/album/${id}`)
};