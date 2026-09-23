const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // 1. Coger el token de la cabecera de la petición
  const token = req.header('Authorization');

  // 2. Si no hay token, rechazamos la petición
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  try {
    // 3. Limpiar el token (por si viene con la palabra "Bearer ") y verificarlo
    const tokenPuro = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenPuro, process.env.JWT_SECRET);
    
    // 4. Extraer el ID del usuario del token y guardarlo en la petición
    req.user = decoded;
    
    // 5. Dejarle pasar a la ruta
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = auth;