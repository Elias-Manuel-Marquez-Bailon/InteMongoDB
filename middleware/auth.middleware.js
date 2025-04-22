import jwt from 'jsonwebtoken';

// Clave secreta para firmar los tokens JWT (en producción, usar una variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_temporal';

/**
 * Middleware para verificar la autenticación del usuario
 */
export const authMiddleware = (req, res, next) => {
  // Verificar si es la ruta de login, permitir acceso sin autenticación
  if (req.path === '/login') {
    return next();
  }

  // Obtener el token de las cookies o del header de autorización
  const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];

  // Si no hay token, redirigir al login
  if (!token) {
    // Si es una solicitud API, devolver error 401
    if (req.path.startsWith('/api') || 
        req.path === '/albums' || 
        req.path.startsWith('/album/') || 
        req.path === '/newalbum') {
      return res.status(401).json({ error: 'No autorizado' });
    }
    // Si es una solicitud de página, redirigir al login
    return res.redirect('/login');
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Añadir la información del usuario a la solicitud
    req.user = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    // Si el token es inválido o ha expirado
    if (req.path.startsWith('/api') || 
        req.path === '/albums' || 
        req.path.startsWith('/album/') || 
        req.path === '/newalbum') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    
    // Redirigir al login para solicitudes de página
    res.redirect('/login');
  }
};

/**
 * Middleware simplificado para verificar autenticación en rutas API
 */
export const apiAuthMiddleware = (req, res, next) => {
  // Obtener el token de las cookies o del header de autorización
  const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];

  // Si no hay token, devolver error 401
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Añadir la información del usuario a la solicitud
    req.user = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error de autenticación API:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};