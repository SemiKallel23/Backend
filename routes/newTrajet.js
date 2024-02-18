const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const Trajet = require('../models/trajet');
const reservation = require('../models/reservation');

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
      createdBy
    } = req.body;

    // Création d'un nouveau trajet 
    const newTrajet = new Trajet({
      startAdress,
      departTime,
      endAddress,
      arrivalTime,
      nbrPlaces,
      car,
      createdBy
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
    const trajets = await Trajet.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      {
        $match: {
          $and: [
            { "createdBy": { $ne: [] } }, // Exclude Trajets with no matching users
            { "createdBy.role": "driver" }, // Filter Trajets by the role "conductor"
          ]
        }
      }
    ]);
    // Retourner les détails du profil de l'utilisateur
    res.status(200).json({ trajets: trajets, status: 200 });
  } catch (error) {
    console.error("dfsdfs", error);
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

router.post('/createReservation', async (req, res) => {
  try {
    const {
      createdBy,
      relatedToRoute,
      idDriver
    } = req.body;


    // Création reservation
    const newReservation = new reservation({
      createdBy,
      relatedToRoute,
      idDriver
    });
    await Trajet.findByIdAndUpdate(relatedToRoute, { status: "waiting" })
    await newReservation.save();

    res.status(201).json({ message: 'Création réussite.', reservation: newReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
