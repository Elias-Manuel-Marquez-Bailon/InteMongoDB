import express from "express"
import router from "./routes/musica.js"
import { connectDB } from "./config/Mongodb.js"
import fileUpload from "express-fileupload"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3000

// Configuración mejorada de CORS
const corsOptions = {
  origin: "*", // Permite todas las conexiones - puedes restringirlo después
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token", "Content-Disposition"],
  exposedHeaders: ["Content-Disposition"],
  credentials: true,
}

// Aplicar CORS con las opciones configuradas - IMPORTANTE: debe ir antes de las rutas
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(fileUpload()) // Para manejar archivos

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`El servidor está ejecutándose en el puerto ${PORT}`)
})

// Intentar conectar a la base de datos
connectDB()

// Asignamos las rutas
app.use("/", router)
