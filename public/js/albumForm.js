// Declarar las variables
const form = document.getElementById("albumForm") // Asegúrate de que 'albumForm' sea el ID correcto de tu formulario
const submitBtn = document.getElementById("submitBtn") // Asegúrate de que 'submitBtn' sea el ID correcto de tu botón de envío

// Funciones que probablemente están definidas en otro archivo y necesitas importar o definir aquí
function resetForm() {
  // Lógica para resetear el formulario
  console.log("Formulario reseteado")
}

function refreshAlbums() {
  // Lógica para recargar la lista de álbumes
  console.log("Álbumes recargados")
}

// Enviar formulario
async function handleFormSubmit(e) {
  e.preventDefault()

  const originalBtnText = submitBtn.textContent
  submitBtn.disabled = true
  submitBtn.textContent = "Enviando..."

  try {
    const formData = new FormData(form)
    const albumId = form.getAttribute("data-id")

    // Usar la URL completa del servidor
    const baseUrl = "http://intedba-env.eba-8rhdcqh2.us-east-1.elasticbeanstalk.com"
    const url = albumId ? `${baseUrl}/album/${albumId}` : `${baseUrl}/newalbum`
    const method = albumId ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      body: formData,
      // No incluir Content-Type cuando se usa FormData
      // El navegador lo configurará automáticamente con el boundary correcto
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const result = await response.json()
    alert(result.message || (albumId ? "Álbum actualizado" : "Álbum creado"))
    resetForm()

    // Recargar los álbumes
    refreshAlbums()
  } catch (error) {
    console.error("Error:", error)
    alert(error.message || "Error al procesar la solicitud")
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = originalBtnText
  }
}
