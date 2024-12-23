  const mongoose = require('mongoose');

  const joueurSchema = new mongoose.Schema({
      nom: { type: String, required: true },
      prenom: { type: String, required: true },
      poste: { type: String, required: true },
      numero: { type: Number, required: true },
      equipe: { type: String, required: true },
      statistiques: {
          matchsJoués: { type: Number, default: 0 },
          buts: { type: Number, default: 0 },
          passes: { type: Number, default: 0 },
      }
  });

  module.exports = mongoose.model('Joueur', joueurSchema);
