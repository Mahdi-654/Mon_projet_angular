const express = require('express');
const router = express.Router();
const Match = require('../models/match');

// Créer un nouveau match
router.post('/', async (req, res) => {
    const newMatch = req.body;

    // Validation des données
    if (!newMatch.equipe1 || !newMatch.equipe2 || !newMatch.date || !newMatch.heure || !newMatch.lieu) {
        return res.status(400).send({ error: 'Tous les champs doivent être remplis.' });
    }

    try {
        // Créer le match dans la base de données
        const match = await Match.create(newMatch);
        return res.status(201).send({ message: 'Match créé avec succès', match });
    } catch (err) {
        // En cas d'erreur, afficher des détails dans la console
        console.error("Erreur lors de la création du match :", err);
        
        // Vérifier le type d'erreur et envoyer une réponse appropriée
        if (err.name === 'ValidationError') {
            return res.status(400).send({ error: 'Erreur de validation', details: err.message });
        } else {
            return res.status(500).send({ error: 'Erreur lors de la création du match', details: err.message });
        }
    }
});


// Obtenir tous les matchs
router.get('/', async (req, res) => {
    try {
        const matchs = await Match.find();
        res.send(matchs);
    } catch (err) {
        console.error("Erreur lors de la récupération des matchs :", err);
        res.status(500).send({ error: 'Erreur lors de la récupération des matchs', details: err });
    }
});

// Mettre à jour un match par ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedMatch = req.body;

    try {
        const match = await Match.findByIdAndUpdate(id, updatedMatch, { new: true });
        if (!match) {
            return res.status(404).send({ error: 'Match non trouvé' });
        }
        res.send({ message: 'Match mis à jour avec succès', match });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du match :", err);
        res.status(500).send({ error: 'Erreur lors de la mise à jour du match', details: err });
    }
});

// Supprimer un match par ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const match = await Match.findByIdAndDelete(id);
        if (!match) {
            return res.status(404).send({ error: 'Match non trouvé' });
        }
        res.send({ message: 'Match supprimé avec succès' });
    } catch (err) {
        console.error("Erreur lors de la suppression du match :", err);
        res.status(500).send({ error: 'Erreur lors de la suppression du match', details: err });
    }
});

module.exports = router;
