const express = require('express')
const router = express.Router()
const { getVocab, setVocab, deleteVocab, registrarIntento } = require('../controllers/vocabController')

// IMPORTANTE: Quitamos las llaves de { protect }
const protect = require('../middlewares/auth')

// Rutas básicas (Obtener y Crear)
router.route('/').get(protect, getVocab).post(protect, setVocab)

// Ruta para eliminar
router.route('/:id').delete(protect, deleteVocab)

// NUEVA RUTA: Para el minijuego (Aciertos y fallos)
router.route('/:id/intento').put(protect, registrarIntento)

module.exports = router