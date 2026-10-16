const express = require('express')
const router = express.Router()
const { getVocab, setVocab, updateVocab, deleteVocab, registrarIntento, sincronizarRacha } = require('../controllers/vocabController')
const protect = require('../middlewares/auth')

// Rutas básicas (Obtener y Crear)
router.route('/').get(protect, getVocab).post(protect, setVocab)

// Ruta para sincronizar la racha diaria
router.route('/racha').post(protect, sincronizarRacha)

// NUEVO: Ruta combinada para Actualizar y Eliminar un ID específico
router.route('/:id').put(protect, updateVocab).delete(protect, deleteVocab)

// Ruta para el minijuego (Aciertos y fallos)
router.route('/:id/intento').put(protect, registrarIntento)

module.exports = router