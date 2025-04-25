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
    
    // Agregar boundary automáticamente
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    config.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
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
      
      // Agregar campos básicos
      formData.append('title', albumData.title);
      formData.append('artist_name', albumData.artist_name);
      formData.append('release_date', albumData.release_date);
      formData.append('genre', albumData.genre);
      
      // Agregar canciones
      if (albumData.songs && Array.isArray(albumData.songs)) {
        albumData.songs.forEach((song, index) => {
          if (song.trim() !== '') {
            formData.append(`songs[${index}]`, song);
          }
        });
      }
      
      // Agregar imagen si existe
      if (albumData.cover_image instanceof File) {
        formData.append('cover_image', albumData.cover_image);
      } else if (typeof albumData.cover_image === 'string') {
        // Si es base64, convertirlo a Blob
        const blob = await fetch(albumData.cover_image).then(r => r.blob());
        formData.append('cover_image', blob, 'cover.jpg');
      }
      
      return await api.post('/newalbum', formData);
    } catch (error) {
      console.error('Error al preparar FormData:', error);
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