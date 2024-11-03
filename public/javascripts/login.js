document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const loginBtn = document.getElementById('login-btn');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        // Capture form data
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        if (loginBtn.textContent === 'Login') {

            // Send login request to the Spring Boot backend
            const response = await axios.post('http://localhost:8090/login', {
                username: username,
                password: password
            });

            if (response.data.success) {
                sessionStorage.setItem('username', username);
                window.location.href = '/';
            } else {
                const error = document.querySelector('.error-message');
                error.innerHTML = 'Invalid username or password.';
                error.style.display = 'block';
                error.style.margin = '10px';
            }
        } else if (loginBtn.textContent === 'Register') {
            // Send registration request to the Spring Boot backend
            const response = await axios.post('http://localhost:8090/register', {
                username: username,
                password: password
            });

            if (response.data.success) {

                sessionStorage.setItem('username', username);

                window.location.href = '/'; // or redirect to login page
            } else {
                const error = document.querySelector('.error-message');
                error.innerHTML = 'Registration failed. Username may already exist.';
                error.style.display = 'block';
                error.style.margin = '10px';
            }
        }
    });

    // Event listener for the register link
    const registerLinkDiv = document.getElementById('register-link');
    const registerLink = document.getElementById('register_link_click');

    registerLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior of the link

        document.querySelector('input[name="username"]').value = '';
        document.querySelector('input[name="password"]').value = '';

        // Hide the register-link div
        registerLinkDiv.style.display = 'none';

        // Change the text of the login button to "Register"
        loginBtn.textContent = 'Register';
    });
});
