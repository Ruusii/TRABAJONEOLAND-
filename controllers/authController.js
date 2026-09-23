const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Comprobar si el correo ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Ese email ya está en uso' });
    }

    // 2. Encriptar la contraseña por seguridad
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear y guardar el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    
    // 4. Devolver respuesta de éxito
    res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      user: { name: newUser.name, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Comprobar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // 2. Comprobar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // 3. Generar el Token (JWT)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Devolver el token y los datos del usuario
    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { registerUser, loginUser };