const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Importer le module sqlite3

const app = express();
const port = 3000;

// Activer CORS pour toutes les origines
app.use(cors());

// On spécifie à Express que les dossiers sont accessible "publiquement"
//En gros, on accorde l'accès à nos dossiers à notre serveur : 
app.use('/Films',express.static(path.join(__dirname, "Structure/Pages des Films")));
app.use('/Accueil',express.static(path.join(__dirname, "Structure/Page d'accueil")));
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

// Route pour récupérer les données de la table Films
app.get('/api/films', (req, res) => {
  const sql = 'SELECT DISTINCT Films.*, thèmes FROM Films, AVOIR WHERE Films.idFilm = AVOIR.idFilm;'; // Requête SQL pour récupérer toutes les lignes de la table Films
  
  db.all(sql, [], (err, rows) => {  // Exécute la requête
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);  // Envoie les résultats en JSON au client
  });
});

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "Structure/Page d'accueil", 'projet_accueil.html'));
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
