document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
    setupChatLink();
    initializeSelects(); // Call the function to initialize select elements
});

function checkLoginStatus() {
    const chatLink = document.querySelector('.active');
    const login = document.querySelector('.login');
    const username = sessionStorage.getItem('username');
    const userNameDisplay = document.getElementById('user-name');

    if (username) {
        chatLink.style.display = 'inline-block';
        login.style.display = 'none';
        userNameDisplay.textContent = `${username}`;
        userNameDisplay.style.display = 'inline';
        console.log('username index: ', username);
    }
}

function setupChatLink() {
    document.getElementById('start-chat-btn').addEventListener('click', () => {
        const username = document.getElementById('username-input').value;
        sessionStorage.setItem('username', username);
        window.location.href = 'chat.html';
    });
}

// Function to initialize select elements
function initializeSelects() {
    const countrySelect = document.getElementById('country-select');
    const competitionSelect = document.getElementById('competition-select');
    const clubSelect = document.getElementById('club-select');
    const playerSelect = document.getElementById('player-select');

    let countriesLoaded = false; // Track if countries are loaded
    let competitionsLoaded = false; // Track if competitions are loaded

    // Initially disable all selects except the first one
    competitionSelect.disabled = true;
    clubSelect.disabled = true;
    playerSelect.disabled = true;

    // Fetch countries when the country select is clicked (only once)
    countrySelect.addEventListener('click', async function () {
        if (!countriesLoaded) { // Only load once
            try {
                console.log('Fetching countries...');
                const response = await axios.get(`/server8090/competitions/country`); // Adjust route if needed
                console.log('Countries:', response.data);
                displayOptions(countrySelect, response.data); // Display fetched options
                countriesLoaded = true; // Set flag to true
            } catch (error) {
                console.error('Error during fetching countries:', error);
            }
        }
    });

    // Event handler for country select (on change)
    countrySelect.addEventListener('change', function () {
        const selectedCountry = this.value; // Get the selected country
        console.log('Selected country:', selectedCountry);

        competitionSelect.disabled = !selectedCountry; // Enable competition select if a country is selected
        clubSelect.disabled = true; // Reset club select
        playerSelect.disabled = true; // Reset player select

        // Clear dependent selects when country changes
        competitionSelect.innerHTML = '<option value="">Select Competition</option>';
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';

        competitionsLoaded = false; // Reset competitions load flag on country change
    });

    // Fetch competitions when the competition select is clicked (only once per country)
    competitionSelect.addEventListener('click', async function () {
        if (!competitionSelect.disabled && !competitionsLoaded) {
            try {
                const country = countrySelect.value; // Get the selected country
                console.log('Fetching competitions for country:', country);
                const response = await axios.get(`/server8090/${country}/competitions`);
                console.log('Competitions:', response.data);
                displayOptions(competitionSelect, response.data); // Display fetched options
                competitionsLoaded = true; // Set flag to true
            } catch (error) {
                console.error('Error during fetching competitions:', error);
            }
        }
    });

    // Event handler for competition select (on change)
    competitionSelect.addEventListener('change', function () {
        const selectedCompetition = this.value; // Get the selected competition
        console.log('Selected competition:', selectedCompetition);
        clubSelect.disabled = !selectedCompetition; // Enable club select if a competition is selected
        playerSelect.disabled = true; // Reset player select

        // Clear dependent selects when competition changes
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';
    });

    // Event handler for club select
    clubSelect.addEventListener('change', function () {
        const selectedClub = this.value; // Get the selected club
        console.log('Selected club:', selectedClub);
        playerSelect.disabled = !selectedClub; // Enable player select if a club is selected
    });

    // Event handler for player select
    playerSelect.addEventListener('change', function () {
        const selectedPlayer = this.value; // Get the selected player
        console.log('Selected player:', selectedPlayer); // Log selected player
    });
}

// Function to display options in a select element
function displayOptions(selectElement, options) {
    selectElement.innerHTML = ''; // Clear existing options
    // Create an option element for each item in the options array
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option; // Use competition_id or appropriate value
        optionElement.textContent = option; // Display competition_code or appropriate text
        selectElement.appendChild(optionElement); // Append to the select
    });
}

// Remove the username from sessionStorage when the page is closed
window.onbeforeunload = function () {
    sessionStorage.removeItem('username');
};
