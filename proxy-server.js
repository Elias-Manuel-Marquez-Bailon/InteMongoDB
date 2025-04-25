import express from "express"
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()
// Cambiamos el puerto a 3000 para que coincida con tu aplicación
const PORT = process.env.PORT || 3000

// Configuración de CORS para el servidor proxy
app.use(cors())

// Configuración del proxy
const apiProxy = createProxyMiddleware({
  target: "http://intedba-env.eba-8rhdcqh2.us-east-1.elasticbeanstalk.com",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "", // Reescribe /api/albums a /albums en el servidor destino
  },
  onProxyRes: (proxyRes, req, res) => {
    // Asegurarse de que las respuestas tengan los encabezados CORS correctos
    proxyRes.headers["Access-Control-Allow-Origin"] = "*"
    proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
  },
  logLevel: "debug", // Para ver los logs detallados durante el desarrollo
})

// Aplicar el proxy a todas las rutas que comiencen con /api
app.use("/api", apiProxy)

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/test", (req, res) => {
  res.json({ message: "El servidor proxy está funcionando correctamente" })
})

// Servir archivos estáticos
app.use(express.static("public"))

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor proxy ejecutándose en http://localhost:${PORT}`)
})
