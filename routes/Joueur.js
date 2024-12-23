const express = require('express');
const router = express.Router();
const Joueur = require('../models/Joueur'); // Assurez-vous que le chemin est correct

// Route pour ajouter un joueur
router.post('/', async (req, res) => {
    try {
        const joueur = new Joueur(req.body);
        await joueur.save();
        res.status(201).json(joueur);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Route pour obtenir tous les joueurs
router.get('/', async (req, res) => {
    try {
        const joueurs = await Joueur.find();
        res.json(joueurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtenir un joueur par ID
router.get('/:id', async (req, res) => {
  try {
      const joueur = await Joueur.findById(req.params.id);
      if (!joueur) {
          return res.status(404).json({ message: 'Joueur non trouvé' });
      }
      res.json(joueur);
  } catch (err) {
      console.error(err); // Afficher l'erreur dans la console
      res.status(500).json({ message: err.message });
  }
});



const mongoose = require('mongoose');

router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    // Vérification si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide' });
    }

    try {
        const joueur = await Joueur.findByIdAndUpdate(id, req.body, { new: true });
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.json(joueur);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Route pour supprimer un joueur
router.delete('/:id', async (req, res) => {
    console.log('ID du joueur à supprimer:', req.params.id); // Affichage de l'ID dans la console
    try {
        const joueur = await Joueur.findByIdAndDelete(req.params.id);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.json({ message: 'Joueur supprimé' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la suppression du joueur' });
    }
});




module.exports = router;
