const mongoose = require('mongoose');

const classementSchema = new mongoose.Schema({
    equipe: { type: String, required: true },
    points: { type: Number, required: true },
    matchesJoues: { type: Number, required: true },
    wins: { type: Number, required: true },
    draws: { type: Number, required: true },
    losses: { type: Number, required: true },
}, { timestamps: true });

const Classement = mongoose.model('Classement', classementSchema);

module.exports = Classement;
