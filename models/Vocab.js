const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
  norwegian: { type: String, required: true, trim: true },
  spanish: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'General' },
  // NUEVO: Frases de ejemplo en contexto
  ejemploNoruego: { type: String, trim: true, default: '' },
  ejemploEspanol: { type: String, trim: true, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aciertos: { type: Number, default: 0 },
  fallos: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vocab', vocabSchema);