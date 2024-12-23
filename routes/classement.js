const express = require('express');
const router = express.Router();
const Classement = require('../models/classement');

// Créer un nouveau classement
router.post('/', async (req, res) => {
    const newClassement = req.body;
    try {
        const classement = await Classement.create(newClassement);
        res.status(201).send({ message: 'Classement créé avec succès', classement });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la création du classement', details: err });
    }
});

// Obtenir tous les classements
router.get('/', async (req, res) => {
    try {
        const classements = await Classement.find();
        res.send(classements);
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la récupération des classements', details: err });
    }
});

// Mettre à jour un classement par ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedClassement = req.body;
    try {
        const classement = await Classement.findByIdAndUpdate(id, updatedClassement, { new: true });
        if (!classement) {
            return res.status(404).send({ error: 'Classement non trouvé' });
        }
        res.send({ message: 'Classement mis à jour avec succès', classement });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la mise à jour du classement', details: err });
    }
});







// Supprimer un classement par ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const classement = await Classement.findByIdAndDelete(id);
        if (!classement) {
            return res.status(404).send({ error: 'Classement non trouvé' });
        }
        res.send({ message: 'Classement supprimé avec succès' });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la suppression du classement', details: err });
    }
});


module.exports = router;
