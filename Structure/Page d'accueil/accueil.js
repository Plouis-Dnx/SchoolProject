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
    const container = document.getElementById('data-container');

    // Parcourir les données et les afficher dans des éléments HTML
    data.forEach((item) => {
      const element = document.createElement('div');
      element.classList.add('data-item');
      
      // Ajouter des informations à l'élément créé
      element.innerHTML = `
        <h3>ID: ${item.idFilm} </h3>
        <p>Nom: ${item.titre} </p>
        <p>Description: ${item.description}</p>
      `;
      
      // Ajouter l'élément au conteneur
      container.appendChild(element);
    });
  })
  .catch((error) => {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error);
  });
