const express = require('express');
const router = express.Router();
const { createVocab, getVocabs, updateVocab, deleteVocab } = require('../controllers/vocabController');
const auth = require('../middlewares/auth'); // Importamos el portero

// Todas estas rutas ahora requieren pasar por "auth" primero
router.post('/', auth, createVocab);
router.get('/', auth, getVocabs);
router.put('/:id', auth, updateVocab);
router.delete('/:id', auth, deleteVocab);

module.exports = router;