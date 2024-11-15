CREATE TABLE Films( 
   idFilm INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
   titre VARCHAR(100), 
   durée TIME,
   année_de_sortie DATE,
   description VARCHAR(300)
);

CREATE TABLE Réalisteurs(
   idRéalisateur INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
   nomRéalisateur VARCHAR(50), 
   pnomRéalisateur VARCHAR(50)
);

CREATE TABLE Acteurs(
   idActeur INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
   nomActeur VARCHAR(50), 
   pnomActeur VARCHAR(50)
);

CREATE TABLE Thèmes( 
   thèmes VARCHAR(50), 
   PRIMARY KEY(thèmes) 
);

CREATE TABLE Utilisateurs(
   idUt INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
   nomUt VARCHAR(50),
   pnomUt VARCHAR(50), 
   mdp VARCHAR(20)
);

CREATE TABLE NOTER(
   idFilm INT, 
   idUt INT, 
   note DECIMAL(2,1),
   commentaire VARCHAR(500), 
   PRIMARY KEY(idFilm, idUt), 
   FOREIGN KEY(idFilm) REFERENCES Films(idFilm), 
   FOREIGN KEY(idUt) REFERENCES Utilisateurs(idUt) 
);

CREATE TABLE AVOIR( 
   idFilm INT, 
   idActeur INT,
   idRéalisateur INT,
   thèmes VARCHAR(50),
   PRIMARY KEY(idFilm, idActeur, idRéalisateur, thèmes),
   FOREIGN KEY(idFilm) REFERENCES Films(idFilm), 
   FOREIGN KEY(idActeur) REFERENCES Acteurs(idActeur),
   FOREIGN KEY(idRéalisateur) REFERENCES Réalisteurs(idRéalisateur),
   FOREIGN KEY(thèmes) REFERENCES Thèmes(thèmes) 
);