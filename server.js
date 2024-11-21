const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Importer le module sqlite3

const app = express();
const port = 3000;

// Activer CORS pour toutes les origines
app.use(cors());

// Serve les fichiers statiques (HTML, CSS, JS) à partir du dossier 'public'
app.use(express.static(path.join(__dirname, "Structure/Page d'accueil")));

// Connexion à la base de données SQLite
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

// Route pour récupérer les données de la table utilisateurs
app.get('/api/films', (req, res) => {
  const sql = 'SELECT * FROM Films'; // Requête SQL pour récupérer toutes les lignes de la table utilisateurs
  
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
  res.sendFile(path.join(__dirname, "Structure/Page d'accueil", 'test.html'));
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
