// Récupération du formulaire par son ID
const form = document.getElementById('myForm');

// Ajout d'un écouteur d'événements pour la soumission du formulaire
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des données du formulaire
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validation des champs
  if (!email) {
    alert("L'email est requis.");
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    alert("Veuillez entrer une adresse email valide.");
    return;
  }
  if (!password) {
    alert("Le mot de passe est requis.");
    return;
  }
  if (password.length < 8) {
    alert("Le mot de passe doit contenir au moins 8 caractères.");
    return;
  }

  // Préparation des données à envoyer
  const formData = {
    email: email,
    password: password,
  };

  // Envoi des données au serveur
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData), // Conversion en JSON
  })
    .then((response) => {
      // Vérification du statut de la réponse
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error('Identifiants incorrects.');
      } else {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      }
    })
    .then((data) => {
      // Succès : afficher un message ou rediriger l'utilisateur
      alert('Connexion réussie !');
      window.location.href = '/dashboard'; // Exemple de redirection
    })
    .catch((error) => {
      // Gestion des erreurs
      console.error('Erreur lors de la connexion :', error);
      alert(error.message);
    });
});
