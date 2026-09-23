const Vocab = require('../models/Vocab');

// Añadir una nueva palabra enlazada al usuario
const createVocab = async (req, res) => {
  try {
    const { norwegian, spanish, category } = req.body;
    
    // Añadimos el req.user.id que nos pasa el middleware
    const newWord = new Vocab({ 
      norwegian, 
      spanish, 
      category,
      user: req.user.id 
    });
    
    await newWord.save();
    res.status(201).json({ message: 'Palabra añadida con éxito', word: newWord });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la palabra', error: error.message });
  }
};

// Obtener solo el vocabulario del usuario logueado
const getVocabs = async (req, res) => {
  try {
    // Filtramos para que busque solo las palabras de este usuario
    const words = await Vocab.find({ user: req.user.id });
    res.status(200).json(words);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el vocabulario', error: error.message });
  }
};

// Modificar una palabra existente (asegurando que sea del usuario)
const updateVocab = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWord = await Vocab.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Busca por ID de palabra Y de usuario
      req.body, 
      { new: true }
    );
    
    if (!updatedWord) {
      return res.status(404).json({ message: 'Palabra no encontrada o no autorizada' });
    }
    res.status(200).json({ message: 'Palabra actualizada', word: updatedWord });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

// Borrar una palabra (asegurando que sea del usuario)
const deleteVocab = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWord = await Vocab.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!deletedWord) {
      return res.status(404).json({ message: 'Palabra no encontrada o no autorizada' });
    }
    res.status(200).json({ message: 'Palabra borrada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar', error: error.message });
  }
};

module.exports = { createVocab, getVocabs, updateVocab, deleteVocab };