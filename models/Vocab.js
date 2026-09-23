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
    ref: 'User', // Esto crea la relación con el modelo User
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vocab', vocabSchema);