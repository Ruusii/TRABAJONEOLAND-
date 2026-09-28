const Vocab = require('../models/Vocab')
const User = require('../models/User')

// @desc    Obtener vocabulario del usuario
// @route   GET /api/vocab
// @access  Privado
const getVocab = async (req, res) => {
  try {
    const vocabulario = await Vocab.find({ user: req.user.id })
    res.status(200).json(vocabulario)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el vocabulario' })
  }
}

// @desc    Añadir nueva palabra
// @route   POST /api/vocab
// @access  Privado
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

// @desc    Eliminar palabra
// @route   DELETE /api/vocab/:id
// @access  Privado
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

// @desc    Registrar un acierto o fallo en el minijuego
// @route   PUT /api/vocab/:id/intento
// @access  Privado
const registrarIntento = async (req, res) => {
  try {
    const palabra = await Vocab.findById(req.params.id)

    if (!palabra) {
      return res.status(404).json({ message: 'Palabra no encontrada' })
    }

    if (palabra.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    const { resultado } = req.body

    if (resultado === 'acierto') {
      palabra.aciertos += 1
    } else if (resultado === 'fallo') {
      palabra.fallos += 1
    } else {
      return res.status(400).json({ message: 'Resultado no válido' })
    }

    const palabraActualizada = await palabra.save()
    res.status(200).json(palabraActualizada)
    
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el intento', error: error.message })
  }
}

// @desc    Calcular y actualizar la racha diaria del usuario
// @route   POST /api/vocab/racha
// @access  Privado
const sincronizarRacha = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

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
        // Entró ayer: sumamos 1 día a la racha
        user.rachaDias = (user.rachaDias || 0) + 1
        user.ultimaConexion = new Date()
        recompensaHoy = true
      } else if (diferenciaDias > 1) {
        // Perdió la racha: vuelve a empezar en 1
        user.rachaDias = 1
        user.ultimaConexion = new Date()
        recompensaHoy = true
      }
      // Si diferenciaDias === 0, ya se conectó hoy y mantenemos su racha
    }

    await user.save()

    res.status(200).json({
      name: user.name,
      rachaDias: user.rachaDias || 1,
      ultimaConexion: user.ultimaConexion,
      recompensaHoy
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar racha', error: error.message })
  }
}

module.exports = {
  getVocab,
  setVocab,
  deleteVocab,
  registrarIntento,
  sincronizarRacha
}