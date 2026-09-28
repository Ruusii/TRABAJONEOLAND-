const express = require('express')
const router = express.Router()
const { getVocab, setVocab, deleteVocab, registrarIntento, sincronizarRacha } = require('../controllers/vocabController')
const protect = require('../middlewares/auth')

// Rutas básicas (Obtener y Crear)
router.route('/').get(protect, getVocab).post(protect, setVocab)

// Ruta para sincronizar la racha diaria
router.route('/racha').post(protect, sincronizarRacha)

// Ruta para eliminar
router.route('/:id').delete(protect, deleteVocab)

// Ruta para el minijuego (Aciertos y fallos)
router.route('/:id/intento').put(protect, registrarIntento)

module.exports = router