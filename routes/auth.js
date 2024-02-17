const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyToken = require('../middleware/auth');

// Endpoint pour l'inscription
router.post('/register', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      dateOfBirth,
      phoneNumber,
      role,
      startAddress,
      endAddress,
    } = req.body;

    console.log(req.body)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Assurez-vous que le mot de passe est défini
    if (!password) {
      return res.status(400).json({ message: 'Le mot de passe est manquant.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      dateOfBirth,
      phoneNumber,
      role,
      startAddress,
      endAddress,
    });

    // Enregistrement de l'utilisateur en base de données
    await newUser.save();

    res.status(201).json({ message: 'Inscription réussie.', status: 201, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour la connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérification du mot de passe
    if (!password) {
      return res.status(400).json({ message: 'Le mot de passe est manquant.' });
    }

    // Vérification si user.password est défini
    if (!user.password) {
      return res.status(500).json({ message: 'Le hash du mot de passe est manquant dans la base de données.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Génération du JWT
    const token = jwt.sign({
      userId: user._id,
      role: user?.role,
      email: user.email
    }, 'votre_clé_secrète', { expiresIn: '1h' });

    res.status(200).json({ token, user, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Endpoint pour afficher le profil de l'utilisateur
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir du token
    const userId = req.userId;

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }


    // Retourner les détails du profil de l'utilisateur
    res.status(200).json({ status: 200, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for password reset request
router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a unique token and store it in the user document
    const resetToken = jwt.sign({ userId: user._id }, 'votre_clé_secrète', { expiresIn: '1h' });
    user.resetToken = resetToken;
    await user.save();

    // Send the reset token to the user's email (you need to implement this part)

    res.status(200).json({ message: 'Reset token sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for updating user role
router.put('/update-role', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { role } = req.body;

    // Find the user in the database and update the role
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Rôle utilisateur mis à jour avec succès.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
