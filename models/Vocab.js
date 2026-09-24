const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
  norwegian: {
    type: String,
    required: true,
    trim: true
  },
  spanish: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  // NUEVO: Variables para el algoritmo de aprendizaje
  aciertos: {
    type: Number,
    default: 0
  },
  fallos: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vocab', vocabSchema);