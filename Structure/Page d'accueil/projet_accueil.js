fetch('/api/films')
  .then((response) => {
    // Vérifier si la réponse est OK (code 2xx)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    // Retourner la réponse en JSON
    return response.json();
  })
  .then((data) => {
    // Fonction pour afficher les films dans un conteneur
    const displayMovies = (containerId, movies, limit) => {
      const container = document.getElementById(containerId);

      // Limiter le nombre de films affichés
      movies.slice(0, limit).forEach((item) => {
        const element = document.createElement('div');
        element.classList.add('movie-item');

        // Échapper les caractères pour éviter les erreurs dans les attributs
        const desc = item.description
                        .replaceAll("'", " ") // Remplacer les apostrophes par un espace
                        .replace(/\r\n/g, ' '); // Remplacer les retours à la ligne
        const actors = item.acteurs.map(actor => `${actor.prenom} ${actor.nom}`).join(', ');
        const directors = item.realisateurs.map(director => `${director.prenom} ${director.nom}`).join(', ');

        // Ajouter des informations à l'élément créé
        element.innerHTML = `
          <img src="/Films_posters/${item.affiche}" alt="${item.titre}"
          onclick="openModal('/Films_posters/${item.affiche}', '${item.titre}', '${desc}', '${actors}', '${directors}', '${item.url}')">
        `;
        
        // Ajouter l'élément au conteneur
        container.appendChild(element);
      });
    };

    // Afficher les 3 premiers films dans mg
    displayMovies('mg', data, 3);

    // Choisir 10 films aléatoires pour mg2
    const randomMovies = () => {
      const remainingMovies = data.slice(3); // Récupérer les films restants après ceux affichés dans mg
      const shuffledMovies = remainingMovies.sort(() => Math.random() - 0.5); // Mélanger aléatoirement les films
      return shuffledMovies.slice(0, 9); // Prendre les 10 premiers films après mélange
    };

    // Afficher les films choisis aléatoirement dans mg2
    displayMovies('mg2', randomMovies(), 9);
  })
  .catch((error) => {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error);
  });
