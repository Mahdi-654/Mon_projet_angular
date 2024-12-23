const router = require('express').Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body; // Récupérer aussi le rôle

    if (!username || !email || !password) {
        return res.status(400).send({ status: "notok", msg: "Veuillez entrer toutes les informations requises" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: "notok", msg: "L'utilisateur avec cet email existe déjà" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Si le rôle n'est pas fourni, assigner un rôle 'user' par défaut
        const userRole = role || 'user'; // Rôle par défaut 'user'

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: userRole // Assigner le rôle à l'utilisateur
        });

        const savedUser = await newUser.save();
        res.status(201).send({ status: "ok", user: savedUser });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).send({ status: "notok", msg: "Erreur serveur interne" });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ status: "notok", msg: "Veuillez entrer toutes les données requises" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ status: "notok", msg: "Email ou mot de passe incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ status: "notok", msg: "Email ou mot de passe incorrect" });
        }

        // Create and sign JWT token
        const token = jwt.sign(
            { id: user.id },
            config.get('jwtsecret'),
            { expiresIn: config.get("tokenExpire") || '1h' } // Set expiration time to 1 hour by default
        );

        // Send token and user info
        res.status(200).send({
            status: "ok",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).send({ status: "notok", msg: "Erreur serveur interne" });
    }
});

module.exports = router;
