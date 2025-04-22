
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/albums');
    console.log('Raw response:', response);

    if (!response.ok) throw new Error('No se pudieron obtener los álbumes');

    const albums = await response.json();
    console.log('Álbumes recibidos:', albums);
    renderAlbums(albums);
  } catch (error) {
    console.error(error);
    document.getElementById('albumGallery').innerHTML = '<p>Error al cargar los álbumes.</p>';
  }
});

function renderAlbums(albums) {
  albumGallery.innerHTML = '';

  if (!albums || albums.length === 0) {
    albumGallery.innerHTML = '<p>No hay álbumes disponibles</p>';
    return;
  }

  albums.forEach(album => {
    const albumCard = document.createElement('div');
    albumCard.className = 'album-card';

    const coverUrl = album.coverUrl || '/placeholder.jpg'; // <-- imagen del backend o default

    albumCard.innerHTML = `
          <img src="${coverUrl}" 
               alt="${album.title}" 
               class="album-cover"
               onerror="this.onerror=null; this.src='/placeholder.jpg';">
          <h3>${album.title}</h3>
          <p>${album.artist_name}</p>
          <div class="album-menu" data-id="${album._id}">
        <div class="album-menu-dots">
          <div class="album-menu-dot"></div>
          <div class="album-menu-dot"></div>
          <div class="album-menu-dot"></div>
        </div>
      </div>
      <div class="album-dropdown" id="dropdown-${album._id}">
        <div class="dropdown-item edit-album" data-id="${album._id}">Edit</div>
        <div class="dropdown-item delete-album" data-id="${album._id}">Delete</div>
      </div>
        `;
    albumGallery.appendChild(albumCard);

  });

  // Inicializar los menús después de crear todas las tarjetas
  initAlbumMenus();

}

// Función para inicializar los menús de opciones
function initAlbumMenus() {
  // Menú toggle
  document.querySelectorAll('.album-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = menu.getAttribute('data-id');
      const dropdown = document.getElementById(`dropdown-${albumId}`);

      // Cerrar todos los demás dropdowns
      document.querySelectorAll('.album-dropdown.active').forEach(d => {
        if (d.id !== `dropdown-${albumId}`) {
          d.classList.remove('active');
        }
      });

      dropdown.classList.toggle('active');
    });
  });


  // ------- HAsta aqui la funcion cardas
  // Editar álbum
  document.querySelectorAll('.edit-album').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const albumId = btn.getAttribute('data-id');

      try {
        const response = await fetch(`/album/${albumId}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener el álbum');
        }


        const album = await response.json();

        console.log(album);
        openEditModal(album);

        // Manejar la imagen de portada
        if (album.coverUrl) {
          coverPreview.src = album.coverUrl;
          coverPreview.style.display = 'block';
        } else {
          coverPreview.src = '#';
          coverPreview.style.display = 'none';
        }
      } catch (error) {
        console.error('Error al obtener detalles del álbum:', error);
        alert('Error al cargar los detalles del álbum');
      }
    });
  });

  // Eliminar álbum
  document.querySelectorAll('.delete-album').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const albumId = btn.getAttribute('data-id');

      if (confirm('¿Estás seguro de que quieres eliminar este álbum?')) {
        try {
          const response = await fetch(`/album/${albumId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('No se pudo eliminar el álbum');
          }

          // Recargar los álbumes
          refreshAlbums();

          alert('¡Álbum eliminado con éxito!');
        } catch (error) {
          console.error('Error al eliminar el álbum:', error);
          alert('Error al eliminar el álbum');
        }
      }
    });
  });

  // Cerrar dropdowns al hacer clic en cualquier otro lugar
  document.addEventListener('click', () => {
    document.querySelectorAll('.album-dropdown.active').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  });
}

// Función para abrir el modal de edición
function openEditModal(album) {
  // Obtener referencias al modal y al formulario
  const modalOverlay = document.getElementById('modalOverlay');
  const albumForm = document.getElementById('albumForm');

  if (!modalOverlay || !albumForm) {
    console.error('No se encontró el modal o el formulario');
    return;
  }

  // Rellenar el formulario con los datos del álbum
  albumForm.querySelector('input[name="title"]').value = album.title || '';
  albumForm.querySelector('input[name="artist_name"]').value = album.artist_name || '';

  // Formatear la fecha para el input (YYYY-MM-DD)
  if (album.release_date) {
    const date = new Date(album.release_date);
    const formattedDate = date.toISOString().split('T')[0];
    albumForm.querySelector('input[name="release_date"]').value = formattedDate;
  }

  albumForm.querySelector('input[name="genre"]').value = album.genre || '';

  // Manejar las canciones
  const songsContainer = document.getElementById('songsContainer');
  if (songsContainer) {
    songsContainer.innerHTML = '';

    if (album.songs && album.songs.length > 0) {
      album.songs.forEach((song, index) => {
        const songInput = document.createElement('div');
        songInput.className = 'song-input';
        songInput.innerHTML = `
          <input type="text" name="songs[]" placeholder="Canción ${index + 1}" value="${song}" required>
          <button type="button" class="removeSongBtn">🗑️</button>
        `;

        // Añadir evento al botón de eliminar
        songInput.querySelector('.removeSongBtn').addEventListener('click', function () {
          this.parentElement.remove();
          updateSongPlaceholders();
        });

        songsContainer.appendChild(songInput);
      });
    } else {
      // Añadir un input vacío si no hay canciones
      const songInput = document.createElement('div');
      songInput.className = 'song-input';
      songInput.innerHTML = `
        <input type="text" name="songs[]" placeholder="Canción 1" required>
        <button type="button" class="removeSongBtn">🗑️</button>
      `;

      songInput.querySelector('.removeSongBtn').addEventListener('click', function () {
        this.parentElement.remove();
        updateSongPlaceholders();
      });

      songsContainer.appendChild(songInput);
    }
  }

  // Mostrar la imagen de portada si existe
  const coverPreview = document.getElementById('coverPreview');
  if (coverPreview && album.cover_image) {
    coverPreview.src = `/album/${album._id}/cover`;
    coverPreview.style.display = 'block';
  }

  // Cambiar el action del formulario para la actualización
  albumForm.setAttribute('data-id', album._id);

  // Cambiar el texto del botón de envío
  const submitBtn = albumForm.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = 'Actualizar Álbum';
  }

  // Mostrar el modal
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Función para actualizar los placeholders de los inputs de canciones
function updateSongPlaceholders() {
  const inputs = document.querySelectorAll('#songsContainer input[name="songs[]"]');
  inputs.forEach((input, i) => {
    input.placeholder = `Canción ${i + 1}`;
  });
}

// Función para recargar los álbumes
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

// Función para manejar el envío del formulario
function setupFormSubmission() {
  const albumForm = document.getElementById('albumForm');
  if (!albumForm) return;

  albumForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(albumForm);
    const albumId = albumForm.getAttribute('data-id');

    let url = '/newalbum';
    let method = 'POST';

    // Si estamos editando un álbum existente
    if (albumId) {
      url = `/album/${albumId}`;
      method = 'PUT';
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al guardar el álbum');
      }

      // Cerrar el modal
      const modalOverlay = document.getElementById('modalOverlay');
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }

      // Recargar los álbumes
      refreshAlbums();

      // Resetear el formulario
      albumForm.reset();
      albumForm.removeAttribute('data-id');

      // Resetear el contenedor de canciones
      const songsContainer = document.getElementById('songsContainer');
      if (songsContainer) {
        songsContainer.innerHTML = '';
        const songInput = document.createElement('div');
        songInput.className = 'song-input';
        songInput.innerHTML = `
          <input type="text" name="songs[]" placeholder="Canción 1" required>
          <button type="button" class="removeSongBtn">🗑️</button>
        `;

        songInput.querySelector('.removeSongBtn').addEventListener('click', function () {
          this.parentElement.remove();
          updateSongPlaceholders();
        });

        songsContainer.appendChild(songInput);
      }

      // Resetear la vista previa de la imagen
      const coverPreview = document.getElementById('coverPreview');
      if (coverPreview) {
        coverPreview.src = '#';
        coverPreview.style.display = 'none';
      }

      alert(albumId ? 'Álbum actualizado con éxito' : 'Álbum creado con éxito');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el álbum: ' + error.message);
    }
  });
}

// Configurar el botón para abrir el modal de nuevo álbum
function setupNewAlbumButton() {
  const openModalBtn = document.getElementById('openModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => {
      // Resetear el formulario
      const albumForm = document.getElementById('albumForm');
      if (albumForm) {
        albumForm.reset();
        albumForm.removeAttribute('data-id');

        // Cambiar el texto del botón de envío
        const submitBtn = albumForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Crear Álbum';
        }
      }

      // Resetear el contenedor de canciones
      const songsContainer = document.getElementById('songsContainer');
      if (songsContainer) {
        songsContainer.innerHTML = '';
        const songInput = document.createElement('div');
        songInput.className = 'song-input';
        songInput.innerHTML = `
          <input type="text" name="songs[]" placeholder="Canción 1" required>
          <button type="button" class="removeSongBtn">🗑️</button>
        `;

        songInput.querySelector('.removeSongBtn').addEventListener('click', function () {
          this.parentElement.remove();
          updateSongPlaceholders();
        });

        songsContainer.appendChild(songInput);
      }

      // Resetear la vista previa de la imagen
      const coverPreview = document.getElementById('coverPreview');
      if (coverPreview) {
        coverPreview.src = '#';
        coverPreview.style.display = 'none';
      }

      // Mostrar el modal
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Configurar el botón para cerrar el modal
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Cerrar el modal al hacer clic fuera de él
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
}

// Configurar la funcionalidad de añadir canciones
function setupAddSongButton() {
  const addSongBtn = document.getElementById('addSongBtn');
  if (!addSongBtn) return;

  addSongBtn.addEventListener('click', () => {
    const songsContainer = document.getElementById('songsContainer');
    if (!songsContainer) return;

    const songInput = document.createElement('div');
    songInput.className = 'song-input';
    songInput.innerHTML = `
      <input type="text" name="songs[]" placeholder="Canción" required>
      <button type="button" class="removeSongBtn">🗑️</button>
    `;

    songInput.querySelector('.removeSongBtn').addEventListener('click', function () {
      this.parentElement.remove();
      updateSongPlaceholders();
    });

    songsContainer.appendChild(songInput);
    updateSongPlaceholders();
  });
}

// Configurar la vista previa de la imagen
function setupImagePreview() {
  const fileUploadArea = document.getElementById('fileUploadArea');
  const coverImageInput = document.getElementById('coverImageInput');
  const coverPreview = document.getElementById('coverPreview');

  if (!fileUploadArea || !coverImageInput || !coverPreview) return;

  fileUploadArea.addEventListener('click', () => {
    coverImageInput.click();
  });

  coverImageInput.addEventListener('change', () => {
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
  });
}

// Inicializar todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar los álbumes
  refreshAlbums();

  // Configurar el formulario y los botones
  setupFormSubmission();
  setupNewAlbumButton();
  setupAddSongButton();
  setupImagePreview();
});