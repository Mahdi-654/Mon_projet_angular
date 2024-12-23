const mongoose = require('mongoose');

// Définir le schéma utilisateur
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // L'email doit être unique
    },
    password: {
        type: String,
        required: true, // Le mot de passe est requis
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // Rôles possibles
        default: 'user' // Rôle par défaut
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
