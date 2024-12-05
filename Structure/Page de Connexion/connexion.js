const formConnexion = document.getElementById('form-connexion');
const loginFormDiv = document.getElementById('login-form');
const connectedStateDiv = document.getElementById('connected-state');
const connectedMessage = document.getElementById('connected-message');
const logoutButton = document.getElementById('logout-button');

// Vérifier si l'utilisateur est connecté au chargement de la page
async function checkUserSession() {
    try {
        const response = await fetch('http://localhost:3000/api/session', {
            credentials: 'include' // Nécessaire pour envoyer les cookies
        });

        if (response.ok) {
            const data = await response.json();
            if (data.isLoggedIn) {
                showConnectedState(data.email);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la session :", error);
    }
}

// Affiche l'état connecté
function showConnectedState(email) {
    connectedMessage.innerText = `Connecté en tant que ${email}`;
    loginFormDiv.style.display = 'none';
    connectedStateDiv.style.display = 'block';
}

// Affiche le formulaire de connexion
function showLoginForm() {
    loginFormDiv.style.display = 'block';
    connectedStateDiv.style.display = 'none';
}

// Connexion utilisateur
formConnexion.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Identifier le bouton cliqué
    const action = e.submitter.classList.contains('signin-button') ? 'signin-button' : 'register-button';

    if (action === 'signin-button') {
        // Connexion de l'utilisateur
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Inclure les cookies de session
            });

            const data = await response.json();

            if (response.ok) {
                showConnectedState(data.user.email);
            } else {
                alert(data.error || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.error('Erreur réseau lors de la connexion :', error);
        }

    } else if (action === 'register-button') {
        // Inscription de l'utilisateur
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            } else {
                alert(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur réseau lors de l\'inscription :', error);
        }
    }
});

// Déconnexion utilisateur
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            showLoginForm();
        } else {
            alert('Erreur lors de la déconnexion');
        }
    } catch (error) {
        console.error('Erreur réseau lors de la déconnexion :', error);
    }
});

// Vérifier la session au chargement
checkUserSession();