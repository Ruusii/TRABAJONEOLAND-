const Vocab = require('../models/Vocab')
const User = require('../models/User')

// @desc    Obtener vocabulario del usuario
const getVocab = async (req, res) => {
  try {
    const vocabulario = await Vocab.find({ user: req.user.id })
    res.status(200).json(vocabulario)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el vocabulario' })
  }
}

// @desc    Añadir nueva palabra
const setVocab = async (req, res) => {
  try {
    if (!req.body.norwegian || !req.body.spanish) {
      return res.status(400).json({ message: 'Por favor, añade norwegian y spanish' })
    }

    const palabra = await Vocab.create({
      norwegian: req.body.norwegian,
      spanish: req.body.spanish,
      category: req.body.category || 'General',
      user: req.user.id
    })

    res.status(200).json(palabra)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la palabra', error: error.message })
  }
}

// NUEVO: @desc    Actualizar palabra (Editar)
// @route   PUT /api/vocab/:id
// @access  Privado
const updateVocab = async (req, res) => {
  try {
    const palabra = await Vocab.findById(req.params.id)

    if (!palabra) {
      return res.status(404).json({ message: 'Palabra no encontrada' })
    }

    // Asegurar que el usuario logueado es el dueño
    if (palabra.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    // Actualizamos la palabra manteniendo sus estadísticas intactas
    const palabraActualizada = await Vocab.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json(palabraActualizada)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la palabra' })
  }
}

// @desc    Eliminar palabra
const deleteVocab = async (req, res) => {
  try {
    const palabra = await Vocab.findById(req.params.id)

    if (!palabra) {
      return res.status(404).json({ message: 'Palabra no encontrada' })
    }

    if (palabra.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    await palabra.deleteOne()
    res.status(200).json({ id: req.params.id })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la palabra' })
  }
}

// @desc    Registrar un acierto o fallo
const registrarIntento = async (req, res) => {
  try {
    const palabra = await Vocab.findById(req.params.id)
    if (!palabra) return res.status(404).json({ message: 'Palabra no encontrada' })
    if (palabra.user.toString() !== req.user.id) return res.status(401).json({ message: 'No autorizado' })

    const { resultado } = req.body
    if (resultado === 'acierto') palabra.aciertos += 1
    else if (resultado === 'fallo') palabra.fallos += 1
    
    const palabraActualizada = await palabra.save()
    res.status(200).json(palabraActualizada)
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar intento' })
  }
}

// @desc    Sincronizar racha diaria
const sincronizarRacha = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    let recompensaHoy = false

    if (!user.ultimaConexion) {
      user.rachaDias = 1
      user.ultimaConexion = new Date()
      recompensaHoy = true
    } else {
      const ultima = new Date(user.ultimaConexion)
      ultima.setHours(0, 0, 0, 0)
      const diferenciaDias = Math.round((hoy - ultima) / (1000 * 60 * 60 * 24))

      if (diferenciaDias === 1) {
        user.rachaDias = (user.rachaDias || 0) + 1
        user.ultimaConexion = new Date()
        recompensaHoy = true
      } else if (diferenciaDias > 1) {
        user.rachaDias = 1
        user.ultimaConexion = new Date()
        recompensaHoy = true
      }
    }

    await user.save()
    res.status(200).json({ rachaDias: user.rachaDias || 1, recompensaHoy })
  } catch (error) {
    res.status(500).json({ message: 'Error racha' })
  }
}

module.exports = {
  getVocab,
  setVocab,
  updateVocab, // <-- Añadido al export
  deleteVocab,
  registrarIntento,
  sincronizarRacha
}