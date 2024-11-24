import { openModal, closeModal } from "/Films/modale.js";

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
      
      // Ajouter des informations à l'élément créé
      element.innerHTML = `
        <img src="/Films_posters/${item.Affiche}" alt="${item.titre}"
        onclick="openModal('/Films_posters/${item.Affiche}', '${item.titre}','Description', 'Jean Lasalle', 'Jean Palasal', 'https://www.youtube.com/embed/dQw4w9WgXcQ')">
        <p>${item.titre}</p>
      `;
      
      // Ajouter l'élément au conteneur
      container.appendChild(element);
    });
  })
  .catch((error) => {
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error);
  });
