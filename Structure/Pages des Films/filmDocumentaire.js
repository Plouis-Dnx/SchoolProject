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

      if(item.thèmes === 'Documentaires'){
        // Ajouter des informations à l'élément créé
        element.innerHTML = `
        <img src="/Films_posters/${item.Affiche}" alt="${item.titre}">
        <p>${item.titre}</p>
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
