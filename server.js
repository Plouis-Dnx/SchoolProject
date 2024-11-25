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
  const sql = 'SELECT Films.*, nomActeur, pnomActeur, nomRéalisateur, pnomRéalisateur, thèmes FROM Films, Acteurs, Réalisteurs, AVOIR WHERE Films.idFilm = AVOIR.idFilm AND AVOIR.idActeur = Acteurs.idActeur AND AVOIR.idRéalisateur = Réalisteurs.idRéalisateur;'; 
  // Requête SQL pour récupérer toutes les lignes de la table Films
  
  db.all(sql, [], (err, rows) => {  // Exécute la requête
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Regroupement des données
    const filmsMap = new Map();

    rows.forEach(row => {
      if (!filmsMap.has(row.idFilm)) {
        // Si le film n'existe pas encore dans le Map, on l'ajoute
        filmsMap.set(row.idFilm, {
          idFilm: row.idFilm,
          titre: row.titre,
          duree: row.durée,
          dateSortie: row.année_de_sortie,
          description: row.description,
          affiche: row.Affiche,
          genre: row.thèmes,
          acteurs: [],
          realisateurs: []
        });
      }

      // Récupérer le film actuel
      const film = filmsMap.get(row.idFilm);

      // Ajouter l'acteur si présent
      if (row.nomActeur && row.pnomActeur) {
        film.acteurs.push({ nom: row.nomActeur, prenom: row.pnomActeur });
      }

      // Ajouter le réalisateur si présent
      if (row.nomRéalisateur && row.pnomRéalisateur) {
        const realisateur = { nom: row.nomRéalisateur, prenom: row.pnomRéalisateur };
        // Ajouter uniquement si ce réalisateur n'est pas déjà dans la liste
        if (!film.realisateurs.some(r => r.nom === realisateur.nom && r.prenom === realisateur.prenom)) {
          film.realisateurs.push(realisateur);
        }
      }
    });

    // Convertir le Map en tableau
    const films = Array.from(filmsMap.values());

    res.json(films);
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
