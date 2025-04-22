// ====== Referencias al DOM ======
const form = document.getElementById('albumForm');
const fileUploadArea = document.getElementById('fileUploadArea');
const coverImageInput = document.getElementById('coverImageInput');
const coverPreview = document.getElementById('coverPreview');
const songsContainer = document.getElementById('songsContainer');
const addSongBtn = document.getElementById('addSongBtn');
const submitBtn = form.querySelector('button[type="submit"]');

let currentAlbumId = null;

// ====== Funciones principales ======

// Mostrar vista previa de la imagen de portada
function handleImagePreview() {
  const file = coverImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      coverPreview.src = e.target.result;
      coverPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    coverPreview.src = '#';
    coverPreview.style.display = 'none';
  }
}

// Crear input de canción
function createSongInput(value = '', index = null) {
  const div = document.createElement('div');
  div.className = 'song-input';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'songs[]';
  input.required = true;
  input.value = value;
  input.placeholder = `Canción ${index !== null ? index + 1 : ''}`;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'removeSongBtn';
  removeBtn.textContent = '🗑️';
  removeBtn.addEventListener('click', () => {
    div.remove();
    updateSongPlaceholders();
  });

  div.appendChild(input);
  div.appendChild(removeBtn);
  return div;
}

// Actualizar los placeholders de las canciones
function updateSongPlaceholders() {
  const inputs = songsContainer.querySelectorAll('input[name="songs[]"]');
  inputs.forEach((input, i) => {
    input.placeholder = `Canción ${i + 1}`;
  });
}

// Inicializar inputs de canciones
function initializeSongs(songs = []) {
  songsContainer.innerHTML = '';
  if (songs.length > 0) {
    songs.forEach((song, index) => {
      songsContainer.appendChild(createSongInput(song, index));
    });
  } else {
    songsContainer.appendChild(createSongInput('', 0));
  }
}

// Resetear formulario
function resetForm() {
  form.reset();
  form.removeAttribute('data-id');
  coverPreview.src = '#';
  coverPreview.style.display = 'none';
  initializeSongs();
  coverImageInput.value = '';
  submitBtn.textContent = 'Crear Álbum';
  currentAlbumId = null;
}

// Cargar datos para edición
function loadAlbumData(album) {
  form.querySelector('input[name="title"]').value = album.title || '';
  form.querySelector('input[name="artist_name"]').value = album.artist_name || '';
  
  if (album.release_date) {
    const date = new Date(album.release_date);
    form.querySelector('input[name="release_date"]').value = date.toISOString().split('T')[0];
  }

  form.querySelector('input[name="genre"]').value = album.genre || '';

  if (album.coverUrl) {
    coverPreview.src = album.coverUrl;
    coverPreview.style.display = 'block';
  }

  initializeSongs(album.songs || []);
  form.setAttribute('data-id', album._id);
  submitBtn.textContent = 'Actualizar Álbum';
}

// Enviar formulario
async function handleFormSubmit(e) {
  e.preventDefault();

  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const formData = new FormData(form);
    const albumId = form.getAttribute('data-id');
    const url = albumId ? `/album/${albumId}` : '/newalbum';
    const method = albumId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: formData
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    alert(result.message || (albumId ? 'Álbum actualizado' : 'Álbum creado'));
    resetForm();

    if (typeof loadAlbums === 'function') {
      loadAlbums();
    }

  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Error al procesar la solicitud');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

// Abrir modal para editar álbum
function openEditModal(album) {
  const modalOverlay = document.getElementById('modalOverlay');
  const albumForm = document.getElementById('albumForm');

  if (!modalOverlay || !albumForm) {
    console.error('No se encontró el modal o el formulario');
    return;
  }

  loadAlbumData(album); // Usa la misma lógica de carga

  // Mostrar la portada si existe
  if (album.cover_image) {
    coverPreview.src = `/album/${album._id}/cover`;
    coverPreview.style.display = 'block';
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Recargar la galería de álbumes
async function refreshAlbums() {
  try {
    const response = await fetch('/albums');
    if (!response.ok) throw new Error('No se pudieron obtener los álbumes');

    const albums = await response.json();
    renderAlbums(albums);
  } catch (error) {
    console.error('Error al recargar los álbumes:', error);
    document.getElementById('albumGallery').innerHTML = '<p>Error al cargar los álbumes.</p>';
  }
}

// Preparar el envío del formulario (alternativa)
function setupFormSubmission() {
  form.addEventListener('submit', handleFormSubmit);
}

// ====== Event Listeners ======
fileUploadArea.addEventListener('click', () => coverImageInput.click());
coverImageInput.addEventListener('change', handleImagePreview);

addSongBtn.addEventListener('click', () => {
  const songInputs = songsContainer.querySelectorAll('.song-input');
  songsContainer.appendChild(createSongInput('', songInputs.length));
  updateSongPlaceholders();
});

form.addEventListener('submit', handleFormSubmit);

window.addEventListener('DOMContentLoaded', () => {
  initializeSongs();
});
