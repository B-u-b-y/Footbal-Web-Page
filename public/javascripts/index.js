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
    const newsSelect = document.getElementById('news-container');

    let countriesLoaded = false; // Track if countries are loaded
    let competitionsLoaded = false; // Track if competitions are loaded
    let clubsLoaded = false; // Track if clubs are loaded
    let playersLoaded = false; // Track if players are loaded

    // Initially disable all selects except the first one
    competitionSelect.disabled = true;
    clubSelect.disabled = true;
    playerSelect.disabled = true; // Disable player select initially

    // Fetch countries when the country select is clicked (only once)
    countrySelect.addEventListener('click', async function () {
        if (!countriesLoaded) { // Only load once
            try {
                const response = await axios.get(`/server8090/competitions/country`);
                displayOptions(countrySelect, response.data); // Display fetched options
                countriesLoaded = true; // Set flag to true
            } catch (error) {
                console.error('Error fetching countries:', error);
                alert('Error fetching countries. Please try again later.');
            }
        }
    });

    // Event handler for country select (on change)
    // Event handler for country select (on change)
    countrySelect.addEventListener('change', async function () {
        const selectedCountry = this.value; // Get the selected country

        // Hide the news-container when a country is selected
        const newsContainer = document.querySelector('.news-container');
        if (selectedCountry) {
            newsContainer.style.display = 'none'; // Hide the news container
        } else {
            newsContainer.style.display = 'block'; // Show the news container if no country is selected
        }

        // Clear dependent selects when country changes
        competitionSelect.innerHTML = '<option value="">Select Competition</option>';
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>'; // Reset player select
        clubSelect.disabled = true; // Reset club select
        playerSelect.disabled = true; // Reset player select
        competitionSelect.disabled = !selectedCountry; // Enable competition select if a country is selected

        // Reset competitionsLoaded and clubsLoaded to allow new loading
        competitionsLoaded = false;
        clubsLoaded = false;

        // Clear existing cards in card-container
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = ''; // Clear existing cards

        // Fetch competitions for the selected country
        if(selectedCountry !== '')
            await fetchCompetitions(selectedCountry); // Pass the selected country
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Event handler for competition select (on click)
    competitionSelect.addEventListener('click', async function () {
        if (!competitionsLoaded && countrySelect.value) { // Only load if the country is selected and competitions haven't been loaded yet
            const selectedCountry = countrySelect.value; // Get the selected country
            try {
                const response = await axios.get(`/server8090/${selectedCountry}/competitions`); // Fetch competitions based on selected country
                displayOptions(competitionSelect, response.data, 'competition_id', 'name'); // Display fetched options
                competitionsLoaded = true; // Set flag to true to prevent repeated loading
            } catch (error) {
                console.error('Error fetching competitions:', error);
                alert('Error fetching competitions. Please try again later.');
            }
        }
    });

    // Event handler for competition select (on change)
    competitionSelect.addEventListener('change', async function () {
        const selectedCompetition = this.value; // Get the selected competition

        // Clear club select and player select
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>'; // Reset player select
        clubSelect.disabled = !selectedCompetition; // Enable club select if a competition is selected
        playerSelect.disabled = true; // Disable player select until a club is selected

        // Fetch clubs for the selected competition
        if (selectedCompetition) {
            await fetchClubs(selectedCompetition); // Pass the selected competition
        }
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Event handler for club select (on click)
    clubSelect.addEventListener('click', async function () {
        if (!clubsLoaded && competitionSelect.value) { // Only load if the competition is selected and clubs haven't been loaded yet
            const selectedCompetition = competitionSelect.value; // Get the selected competition
            try {
                const response = await axios.get(`/server8090/${selectedCompetition}/clubs`); // Fetch clubs based on selected competition
                displayOptions(clubSelect, response.data, 'club_id', 'name'); // Display fetched options
                clubsLoaded = true; // Set flag to true to prevent repeated loading
            } catch (error) {
                console.error('Error fetching clubs:', error);
                alert('Error fetching clubs. Please try again later.');
            }
        }
    });

    // Event handler for club select (on change)
    clubSelect.addEventListener('change', async function () {
        const selectedClub = this.value; // Get the selected club

        // Clear existing cards for players and reset player select
        playerSelect.innerHTML = '<option value="">Select Player</option>'; // Reset player select
        playerSelect.disabled = true; // Reset player select

        // Fetch players for the selected club
        if (selectedClub) {
            await fetchPlayers(selectedClub); // Pass the selected club
        }
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Event handler for player select (on click)
    playerSelect.addEventListener('click', async function () {
        if (!playersLoaded && clubSelect.value) { // Only load if the club is selected and players haven't been loaded yet
            const selectedClub = clubSelect.value; // Get the selected club
            try {
                const response = await axios.get(`/server8090/${selectedClub}/players`); // Fetch players based on selected club
                displayOptions(playerSelect, response.data, 'player_id', 'name'); // Display fetched options
                playersLoaded = true; // Set flag to true to prevent repeated loading
            } catch (error) {
                console.error('Error fetching players:', error);
                alert('Error fetching players. Please try again later.');
            }
        }
    });

    // Event handler for player select (on change)
    playerSelect.addEventListener('change', async function () {
        const selectedPlayer = this.value; // Get the selected player ID

        // Clear existing cards in card-container
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = ''; // Clear existing cards

        // Fetch and display the selected player as a card
        if (selectedPlayer) {
            await fetchPlayer(selectedPlayer); // Pass the selected player ID
        }
    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Fetch competitions for the selected country
    async function fetchCompetitions(country) {
        try {
            const response = await axios.get(`/server8090/${country}/competitions`); // Use country parameter
            displayCompetitionsAsCards(response.data); // Display competitions in cards
        } catch (error) {
            console.error('Error fetching competitions:', error);
            alert('Error fetching competitions. Please try again later.');
        }
    }

    // Fetch clubs for the selected competition
    async function fetchClubs(competition) {
        try {
            const response = await axios.get(`/server8090/${competition}/clubs`); // Adjust this endpoint as needed
            displayClubsAsCards(response.data); // Display clubs in cards
        } catch (error) {
            console.error('Error fetching clubs:', error);
            alert('Error fetching clubs. Please try again later.');
        }
    }

    // Fetch players for the selected club
    async function fetchPlayers(club) {
        try {
            const response = await axios.get(`/server8090/${club}/players`); // Adjust this endpoint as needed
            displayPlayersAsCards(response.data); // Display the first player as a card
            playerSelect.disabled = false; // Enable player select
        } catch (error) {
            console.error('Error fetching players:', error);
            alert('Error fetching players. Please try again later.');
        }
    }

    // Fetch player details based on selected player ID
    async function fetchPlayer(playerId) {
        try {
            const response = await axios.get(`/server8090/players/${playerId}`); // Adjust this endpoint to fetch player details
            displayPlayerAsCard(response.data); // Call function to display player as card
        } catch (error) {
            console.error('Error fetching player details:', error);
            alert('Error fetching player details. Please try again later.');
        }
    }
}

// Function to create and display competition cards
function displayCompetitionsAsCards(competitions) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear existing cards

    competitions.forEach(competition => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Create card content
        card.innerHTML = `
            <h4>${competition.name}</h4>
            <p>${competition.competition_id}</p>
            <p>${competition.country_name}</p>
        `;

        cardContainer.appendChild(card); // Append the card to the container
    });
}

// Function to create and display club cards
function displayClubsAsCards(clubs) {
    const cardContainer = document.getElementById('card-container'); // Adjust the container ID if necessary
    cardContainer.innerHTML = ''; // Clear existing cards

    clubs.forEach(club => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Create card content
        card.innerHTML = `
            <h4>${club.name}</h4>
            <p>${club.domestic_competition_id}</p>
            <p>Stadium: ${club.stadium_name}</p>
            <p>Net Transfer Value: ${club.net_transfer_value}</p>
            <p>Last season: ${club.last_season}</p>
        `;

        cardContainer.appendChild(card); // Append the card to the container
    });
}

// Function to create and display player cards
function displayPlayersAsCards(players) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear existing cards

    players.forEach(player => {
        const card = document.createElement('div');
        card.classList.add('player_card'); // Use the class for styling

        // Create card content
        card.innerHTML = `
            <img src="${player.image_url || '../images/default.png'}" alt="${player.name}" class="player-image"> <!-- Use a default image if no image is available -->
            <div class="player-info">
                <h4>${player.name}</h4>
                <p>${player.position}</p>
                <p>Citizenship: ${player.country_of_citizenship}</Citizenship>
                <p>Date of birth: ${player.date_of_birth}</p>
            </div>
        `; // Adjust according to your player data structure

        cardContainer.appendChild(card); // Append the card to the container
    });

    // Ensure cards are displayed correctly with CSS
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'column';
    cardContainer.style.alignItems = 'center'; // Center cards horizontally
}


// Function to display player details as a card
function displayPlayerAsCard(player) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear existing cards

    const card = document.createElement('div');
    card.classList.add('player-card-container'); // Use the new class for styling

    // Create card content
    card.innerHTML = `
        <img src="${player.image_url || '../images/default.png'}" alt="${player.name}" class="player-image">
        <div class="player-info">
            <div class="player-header">
                <h4>${player.name}</h4>
                <p class="dob">Date of birth: <strong>${player.date_of_birth}</strong></p>
            </div>
            <p class="age">Age: <strong>${player.age}</strong></p>
            <p>Position: <strong>${player.position}</strong></p>
            <p>Citizenship: <strong>${player.country_of_citizenship}</strong></p>
            <p>Height: <strong>${player.height_in_cm}</strong></p>
            <p>Preferred foot: <strong>${player.foot}</strong></p>
            <p>Current club: <strong>${player.current_club_name}</strong></p>
            <p>Market value: <strong>${player.market_value_in_eur}</strong></p>
        </div>
    `;

    cardContainer.appendChild(card); // Append the card to the container
}



// Function to display options in a select element
function displayOptions(selectElement, options, valueKey, textKey) {
    selectElement.innerHTML = ''; // Clear existing options


    // Add the default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `Select ${selectElement.id.replace('-select', '')}`;
    selectElement.appendChild(defaultOption); // Add it before appending dynamic options

    options.forEach(option => {
        const optionElement = document.createElement('option');
        if (valueKey === undefined && textKey === undefined) {
            optionElement.value = option; // Use the option value directly
            optionElement.textContent = option; // Use the option text directly
        } else {
            optionElement.value = option[valueKey]; // Use the specified key for the option value
            optionElement.textContent = option[textKey]; // Use the specified key for the display text
        }
        selectElement.appendChild(optionElement); // Append to the select for both cases
    });
}

// Remove the username from sessionStorage when the page is closed
window.onbeforeunload = function () {
    sessionStorage.removeItem('username');
};
