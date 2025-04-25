// Definir variables globales al inicio
const albumGallery = document.getElementById("albumGallery")
const coverPreview = document.getElementById("coverPreview")

// Función para obtener la URL base según el entorno
function getBaseUrl() {
  // Si estamos en desarrollo local, usar el proxy
  if (window.location.hostname === "localhost") {
    return "/api" // Esto irá al proxy que configuramos
  }
  // Si estamos en producción, usar la URL directa sin doble barra
  return "http://intedba-env.eba-8rhdcqh2.us-east-1.elasticbeanstalk.com"
}

// Declarar la función renderAlbums (o importarla si está en otro archivo)
function renderAlbums(albums) {
  albumGallery.innerHTML = "" // Limpiar la galería antes de renderizar
  albums.forEach((album) => {
    const albumCard = document.createElement("div")
    albumCard.classList.add("album-card")
    albumCard.innerHTML = `
            <h3>${album.title}</h3>
            <img src="${album.cover}" alt="Cover de ${album.title}" style="width: 100px; height: 100px;">
            <p>Artista: ${album.artist}</p>
            <p>Género: ${album.genre}</p>
            <button class="edit-album" data-id="${album.id}">Editar</button>
            <button class="delete-album" data-id="${album.id}">Eliminar</button>
        `
    albumGallery.appendChild(albumCard)
  })

  // Agregar event listeners a los botones después de renderizarlos
  document.querySelectorAll(".edit-album").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const albumId = btn.getAttribute("data-id")
      try {
        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/album/${albumId}`)

        if (!response.ok) {
          throw new Error(`No se pudo obtener el álbum: ${response.status} ${response.statusText}`)
        }

        const album = await response.json()
        // Aquí puedes mostrar un formulario para editar el álbum
        console.log("Álbum a editar:", album)
        // Por ejemplo, podrías llenar un modal con los datos del álbum
      } catch (error) {
        console.error("Error:", error)
      }
    })
  })

  document.querySelectorAll(".delete-album").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const albumId = btn.getAttribute("data-id")
      if (confirm("¿Estás seguro de que quieres eliminar este álbum?")) {
        try {
          const baseUrl = getBaseUrl()
          const response = await fetch(`${baseUrl}/album/${albumId}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error(`No se pudo eliminar el álbum: ${response.status} ${response.statusText}`)
          }

          console.log("Álbum eliminado correctamente")
          refreshAlbums() // Recargar la lista de álbumes
        } catch (error) {
          console.error("Error:", error)
        }
      }
    })
  })
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/albums`)
    console.log("Raw response:", response)

    if (!response.ok) throw new Error(`No se pudieron obtener los álbumes: ${response.status} ${response.statusText}`)

    const albums = await response.json()
    console.log("Álbumes recibidos:", albums)
    renderAlbums(albums)
  } catch (error) {
    console.error("Error al cargar álbumes:", error)
    document.getElementById("albumGallery").innerHTML = `<p>Error al cargar los álbumes: ${error.message}</p>`
  }
})

// Función para recargar los álbumes
async function refreshAlbums() {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/albums`)

    if (!response.ok) throw new Error(`No se pudieron obtener los álbumes: ${response.status} ${response.statusText}`)

    const albums = await response.json()
    renderAlbums(albums)
  } catch (error) {
    console.error("Error al recargar los álbumes:", error)
    document.getElementById("albumGallery").innerHTML = `<p>Error al cargar los álbumes: ${error.message}</p>`
  }
}

// Resto de tu código de albumCard.js...
// Asegúrate de usar getBaseUrl() en todas las llamadas fetch

// Por ejemplo, en la función para editar un álbum:
document.querySelectorAll(".edit-album").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const albumId = btn.getAttribute("data-id")
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/album/${albumId}`)
      // Resto del código...
    } catch (error) {
      console.error("Error:", error)
    }
  })
})

// Y en la función para eliminar un álbum:
document.querySelectorAll(".delete-album").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const albumId = btn.getAttribute("data-id")
    if (confirm("¿Estás seguro de que quieres eliminar este álbum?")) {
      try {
        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/album/${albumId}`, {
          method: "DELETE",
        })
        // Resto del código...
      } catch (error) {
        console.error("Error:", error)
      }
    }
  })
})
