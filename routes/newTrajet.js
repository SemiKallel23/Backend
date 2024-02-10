const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const Trajet = require('../models/trajet');

// Endpoint pour l'inscription
router.post('/create', async (req, res) => {
    try {
      const {
        startAdress,
        departTime,
        endAddress,
        arrivalTime,
        nbrPlaces,
        car,
      } = req.body;
  
      // Vérifier si la route existe déjà

  
      // Création d'un nouveau trajet 
      const newTrajet = new Trajet({
        startAdress,
        departTime,
        endAddress,
        arrivalTime,
        nbrPlaces,
        car,
      });
  
      await newTrajet.save();
  
      res.status(201).json({ message: 'Création réussite.', trajet: newTrajet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/trajet', async (req, res) => {
    try {
      // Récupérer l'ID de l'utilisateur à partir du token
      const trajetId = req.trajetId;
  
      // Rechercher l'utilisateur dans la base de données
      const user = await Trajet.findById(trajetId);
  
      if (!user) {
        return res.status(404).json({ message: 'Trajet non trouvé.' });
      }
  
  
      // Retourner les détails du profil de l'utilisateur
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

router.put('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        startAdress,
        departTime,
        endAddress,
        arrivalTime,
        nbrPlaces,
        car,
      } = req.body;
  
      // Vérifier si le trajet existe
      const existingTrajet = await Trajet.findById(id);
  
      if (!existingTrajet) {
        return res.status(404).json({ message: "Trajet non trouvé." });
      }
  
      // Mettre à jour les champs du trajet
      existingTrajet.startAdress = startAdress;
      existingTrajet.departTime = departTime;
      existingTrajet.endAddress = endAddress;
      existingTrajet.arrivalTime = arrivalTime;
      existingTrajet.nbrPlaces = nbrPlaces;
      existingTrajet.car = car;
  
      // Enregistrer les modifications
      await existingTrajet.save();
  
      res.status(200).json({ message: 'Mise à jour réussite.', trajet: existingTrajet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });


  
router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Utiliser deleteOne pour supprimer le trajet par ID
      const deletedTrajet = await Trajet.deleteOne({ _id: id });
  
      if (deletedTrajet.deletedCount === 0) {
        return res.status(404).json({ message: "Trajet non trouvé." });
      }
  
      res.status(200).json({ message: 'Suppression réussite.', trajet: deletedTrajet });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
module.exports = router;
