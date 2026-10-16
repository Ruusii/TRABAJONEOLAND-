const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  rachaDias: { type: Number, default: 0 },
  ultimaConexion: { type: Date, default: null },
  // NUEVO: Sistema de Mascota y Monedas
  monedas: { type: Number, default: 0 },
  avatar: {
    color: { type: String, default: 'base' },
    accesorio: { type: String, default: 'ninguno' },
    ropa: { type: String, default: 'ninguna' }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);