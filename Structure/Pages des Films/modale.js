export function openModal(imageSrc, title, summary, actors, director, trailerUrl) {
    document.getElementById('modal-image').src = imageSrc;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-summary').innerText = summary;
    document.getElementById('modal-actors').innerText = actors;
    document.getElementById('modal-director').innerText = director;

    // Remplacer l'URL YouTube par l'URL d'intégration 'embed'
    document.getElementById('modal-trailer-video').src = trailerUrl;
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'flex'; // Afficher la modale
}

export function closeModal() {
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'none'; // Cacher la modale
    // Supprimer la vidéo pour éviter qu'elle continue à jouer après la fermeture
    document.getElementById('modal-trailer-video').src = "";
}

// Attacher les fonctions à l'objet global `window`
window.openModal = openModal;
window.closeModal = closeModal;