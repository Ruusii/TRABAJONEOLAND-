const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const vocabRoutes = require('./routes/vocabRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en las peticiones

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas con éxito'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/vocab', vocabRoutes);

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('API del Backend de Noruego funcionando 🚀');
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});