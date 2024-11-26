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
    // Sélectionner l'élément du DOM où afficher les données
    const container = document.getElementById('mg');

    // Parcourir les données et les afficher dans des éléments HTML
    data.forEach((item) => {
      const element = document.createElement('div');
      element.classList.add('movie-item');

      if(item.genre === 'Thriller'){
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
      }
    });
  })
  .catch((error) => {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error);
  });
