const express = require('express');
const router = express.Router();
const Training = require('../models/Training'); // Assurez-vous que le chemin est correct


// Récupérer tous les entraînements
router.get('/', async (req, res) => {
    try {
        const trainings = await Training.find();
        res.json(trainings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ajouter un nouvel entraînement
// Ajouter un nouvel entraînement
// Dans votre backend (par exemple, route POST pour ajouter un entraînement)
router.post('/', async (req, res) => {
    const training = new Training({
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        duration: req.body.duration,
        coach: req.body.coach,
        location: req.body.location
    });

    try {
        const newTraining = await training.save();
        res.status(201).json(newTraining);  // Renvoie directement l'objet 'newTraining' au lieu de 'training'
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Mettre à jour un entraînement
router.put('/:id', async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) return res.status(404).json({ message: 'Entraînement non trouvé.' });

        training.title = req.body.title || training.title;
        training.description = req.body.description || training.description;
        training.date = req.body.date ? new Date(req.body.date) : training.date; // Convertir la date en objet Date si présente
        training.duration = req.body.duration || training.duration;
        training.coach = req.body.coach || training.coach;
        training.location = req.body.location || training.location;

        const updatedTraining = await training.save();
        res.json({ message: 'Entraînement mis à jour avec succès.', training: updatedTraining });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Supprimer un entraînement
// Supprimer un entraînement
// Supprimer un entraînement
router.delete('/:id', async (req, res) => {
    try {
        // Vérifier si l'entraînement existe avant de tenter de le supprimer
        const training = await Training.findById(req.params.id);
        if (!training) return res.status(404).json({ message: 'Entraînement non trouvé.' });

        // Utiliser deleteOne() pour supprimer le document
        await Training.deleteOne({ _id: req.params.id });

        res.json({ message: 'Entraînement supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
