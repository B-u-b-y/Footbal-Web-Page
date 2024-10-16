// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

document.getElementById('start-chat-btn').addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    sessionStorage.setItem('username', username); // Store username in sessionStorage
    window.location.href = 'chat.html'; // Navigate to chat page
});

function checkLoginStatus() {
    const chatLink = document.querySelector('.active');
    const login = document.querySelector('.login');
    const username = sessionStorage.getItem('username');
    const userNameDisplay = document.getElementById('user-name');

    if (username) {
        chatLink.style.display = 'inline-block';
        login.style.display = 'none';

        // Mostra il nome dell'utente
        userNameDisplay.textContent = `${username}`;
        userNameDisplay.style.display = 'inline';
        console.log('username index: ', username);
    }
}

window.onbeforeunload = function() {
    sessionStorage.removeItem('username');
};
