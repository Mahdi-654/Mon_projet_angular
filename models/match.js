const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    equipe1: { type: String, required: true },
    equipe2: { type: String, required: true },
    date: { type: Date, required: true },
    heure: { type: String, required: true },
    lieu: { type: String, required: true },
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
