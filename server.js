const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); // Pour sécuriser les mots de passe
const session = require('express-session'); // Pour gérer les sessions utilisateur

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Pour parser les données JSON

// Configuration des sessions utilisateur
app.use(session({
  secret: 'votreCleSecrete',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Pour HTTP uniquement. Mettez `true` si vous utilisez HTTPS
}));

// Accès public aux fichiers
app.use('/Films', express.static(path.join(__dirname, "Structure/Pages des Films")));
app.use('/Accueil', express.static(path.join(__dirname, "Structure/Page d'accueil")));
app.use('/Films_posters', express.static(path.join(__dirname, 'Structure/Films_posters')));
app.use('/Connexion', express.static(path.join(__dirname, 'Structure/Page de Connexion')));

// Connexion à la base de données SQLite
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

// Route pour récupérer les données des films
app.get('/api/films', (req, res) => {
  const sql = `
    SELECT Films.*, nomActeur, pnomActeur, nomRéalisateur, pnomRéalisateur, thèmes 
    FROM Films, Acteurs, Réalisteurs, AVOIR 
    WHERE Films.idFilm = AVOIR.idFilm 
    AND AVOIR.idActeur = Acteurs.idActeur 
    AND AVOIR.idRéalisateur = Réalisteurs.idRéalisateur;
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const filmsMap = new Map();

    rows.forEach(row => {
      if (!filmsMap.has(row.idFilm)) {
        filmsMap.set(row.idFilm, {
          idFilm: row.idFilm,
          titre: row.titre,
          duree: row.durée,
          dateSortie: row.année_de_sortie,
          description: row.description,
          affiche: row.Affiche,
          genre: row.thèmes,
          url: row.url,
          acteurs: [],
          realisateurs: []
        });
      }

      const film = filmsMap.get(row.idFilm);

      if (row.nomActeur && row.pnomActeur) {
        film.acteurs.push({ nom: row.nomActeur, prenom: row.pnomActeur });
      }

      if (row.nomRéalisateur && row.pnomRéalisateur) {
        const realisateur = { nom: row.nomRéalisateur, prenom: row.pnomRéalisateur };
        if (!film.realisateurs.some(r => r.nom === realisateur.nom && r.prenom === realisateur.prenom)) {
          film.realisateurs.push(realisateur);
        }
      }
    });

    const films = Array.from(filmsMap.values());
    res.json(films);
  });
});

// Inscription d'un utilisateur
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Vérification des données
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    // Vérifier si l'email existe déjà dans la base de données
    db.get(`SELECT * FROM Utilisateurs WHERE email = ?`, [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      // Si un utilisateur existe déjà avec cet email, retourner un message d'erreur
      if (existingUser) {
        return res.status(400).json({ error: 'Vous avez déjà un compte, connectez-vous !' });
      }

      // Si l'email est unique, on procède à l'inscription
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        `INSERT INTO Utilisateurs (email, mdp) VALUES (?, ?)`,
        [email, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur serveur.' });
          }
          res.status(201).json({ message: 'Utilisateur créé avec succès.' });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Connexion d'un utilisateur
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM Utilisateurs WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur.' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.mdp); // Utilisez 'mdp' pour le mot de passe
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      req.session.idUt = user.idUt; // Utilisez 'idUt' pour la session
      res.json({ message: 'Connexion réussie.', user: { email: user.email } });
    }
  );
});


// Déconnexion d'un utilisateur
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
    }
    res.json({ message: 'Déconnexion réussie.' });
  });
});

app.get('/api/session', (req, res) => {
  if (req.session.idUt) {
    db.get(
      `SELECT email FROM Utilisateurs WHERE idUt = ?`,
      [req.session.idUt],
      (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur serveur.' });
        }
        if (!user) {
          return res.status(401).json({ error: 'Session invalide.' });
        }
        res.json({ isLoggedIn: true, email: user.email });
      }
    );
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "Structure/Page d'accueil", 'projet_accueil.html'));
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
