const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  // NUEVO: Sistema de gamificación y constancia
  rachaDias: {
    type: Number,
    default: 0
  },
  ultimaConexion: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);