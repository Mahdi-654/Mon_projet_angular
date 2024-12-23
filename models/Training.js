const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }, // Le champ 'date' est de type Date
    duration: { type: Number, required: true },
    coach: { type: String, required: true },
    location: { type: String, required: true }
});

module.exports = mongoose.model('Training', trainingSchema);
