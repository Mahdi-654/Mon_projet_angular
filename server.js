const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt'); // Importez bcrypt pour le hachage des mots de passe
const User = require('./models/User'); // Assurez-vous d'importer votre modèle utilisateur

const users = require('./routes/Users');
const joueurRoutes = require('./routes/Joueur');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const matchsRoutes = require('./routes/match'); // Remplacez 'matchs' par 'match'
const classementRoutes = require('./routes/classement'); // Importation des routes classement
const trainingRoutes = require('./routes/trainingRoutes');

// Initialiser l'application Express
const app = express();

// Configuration de la session
const store = new MongoDBStore({
  uri: config.get('mongo_url'), // URL de connexion MongoDB depuis le fichier de configuration
  collection: 'sessions', // Nom de la collection où stocker les sessions
});

// Gérer les erreurs de la session
store.on('error', function(error) {
  console.error(error);
});

// Middleware de session
app.use(session({
  secret: 'votreSecretDeSession', // Clé secrète pour signer les sessions
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Durée de vie des cookies de session (1 jour)
  }
}));

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:4200', // URL du frontend Angular
  credentials: true // Autoriser l'envoi des cookies de session
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Node.js application',
      contact: {
        name: 'Mahdi Chaouch'
      },
      servers: [
        {
          url: 'http://localhost:3001',
        },
      ],
    },
  },
  apis: ['./routes/*.js'], // Chemin vers les fichiers de routes pour générer la documentation
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Routes API
app.use('/api/users', users);
app.use('/api/joueurs', joueurRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/matchs', matchsRoutes); // Cela devrait être matchsRoutes
app.use('/api/classement', classementRoutes); 
app.use('/api/trainings', trainingRoutes);


// Connexion à MongoDB
const mongo_url = config.get('mongo_url');
mongoose.set('strictQuery', true);

// Connexion à MongoDB avec gestion des erreurs
mongoose
  .connect(mongo_url)
  .then(() => console.log('MongoDB connected ...'))
  .catch((err) => console.log(err));

// Route de connexion (login)
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Utilisateur introuvable.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Mot de passe incorrect.' });

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role, // Enregistrez le rôle dans la session
    };

    res.json({ msg: `Bienvenue ${user.username}`, user: req.session.user });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ msg: 'Erreur interne du serveur' });
  }
});


// Middleware de vérification de rôle
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Accès interdit : vous devez être administrateur.' });
  }
}

// Exemple de route protégée pour l’administrateur
app.get('/api/admin/dashboard', checkAdmin, (req, res) => {
  res.send(`Bienvenue ${req.session.user.username} sur le tableau de bord de l'administrateur !`);
});

// Route protégée (exemple de dashboard)
app.get('/api/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`Bienvenue ${req.session.user.username} sur votre dashboard !`);
  } else {
    res.status(401).send('Vous devez vous connecter pour accéder à cette page.');
  }
});

// Route de déconnexion (logout)
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Erreur lors de la déconnexion.');
    }
    res.send('Déconnexion réussie.');
  });
});

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Démarrer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
