// Global variables to store the current competition ID and standings cache
let currentCompetitionId = null;
let standingsCache = {};

// Event listener for DOMContentLoaded to initiate functions once the document is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    checkLoginStatus(); // Check the current login status of the user
    setupChatLink(); // Set up the chat link for starting a chat with a username
    initializeSelects(); // Call the function to initialize dropdown/select elements
});

// Function to check the login status of the user
function checkLoginStatus() {
    const chatLink = document.querySelector('.active'); // Get the chat link element
    const login = document.querySelector('.login'); // Get the login link element
    const username = sessionStorage.getItem('username'); // Retrieve username from session storage
    const userNameDisplay = document.getElementById('user-name'); // Get the username display element

    // If username exists in session storage, update UI to reflect the logged-in state
    if (username) {
        if (chatLink) chatLink.style.display = 'inline-block'; // Show chat link
        if (login) login.style.display = 'none'; // Hide login link
        userNameDisplay.textContent = username; // Display the username
        userNameDisplay.style.display = 'inline'; // Show username in UI
        const button_container = document.querySelector('.btn-container');
        button_container.style.display = 'none';

        // Add hover effect to display "Logout"
        userNameDisplay.style.position = 'relative';
        const logoutText = document.createElement('span');
        logoutText.style.fontFamily = 'Poppins';
        logoutText.style.fontSize = '14px';
        logoutText.textContent = 'Logout';
        logoutText.style.position = 'absolute';
        logoutText.style.top = '100%'; // Position below the username
        logoutText.style.left = '0';
        logoutText.style.opacity = '0'; // Start hidden for fade effect
        logoutText.style.transition = 'opacity 0.3s ease'; // Add fade transition
        logoutText.style.pointerEvents = 'none'; // Prevent interaction when hidden
        logoutText.style.backgroundColor = '#fff'; // White background
        logoutText.style.padding = '5px 10px';
        logoutText.style.border = '1px solid #ddd';
        logoutText.style.borderRadius = '5px';
        logoutText.style.zIndex = '10'; // Ensure it's above other elements
        userNameDisplay.appendChild(logoutText);

        userNameDisplay.addEventListener('mouseover', () => {
            userNameDisplay.style.textDecoration = 'underline';
        });

        // Show "Logout" on click
        userNameDisplay.addEventListener('click', () => {
            logoutText.style.fontWeight = 'bold';
            logoutText.style.opacity = '1'; // Fade in
            logoutText.style.pointerEvents = 'auto'; // Allow interaction when visible
        });

        // Variable to hold the timeout ID
        let timeoutId;

        userNameDisplay.addEventListener('mouseleave', () => {
            // Clear any existing timeout to avoid stacking delays
            clearTimeout(timeoutId);
            // Set a timeout to hide the logout text after 1 second (1000 milliseconds)
            timeoutId = setTimeout(() => {
                logoutText.style.opacity = '0'; // Fade out
                logoutText.style.pointerEvents = 'none'; // Prevent interaction when hidden
            }, 1000);
            userNameDisplay.style.textDecoration = 'none';
        });

        // Add click event listener for logout
        logoutText.addEventListener('click', () => {
            sessionStorage.removeItem('username'); // Clear username from session storage
            window.location.reload(); // Reload the page
            chatLink.style.display = 'none'; // Hide chat link
            login.style.display = 'inline-block'; // Show login link
            userNameDisplay.style.display = 'none'; // Hide username display
        });
    }
}

// Function to set up the chat link button click event
function setupChatLink() {
    document.getElementById('start-chat-btn').addEventListener('click', () => {
        const username = document.getElementById('username-input').value; // Get username from input
        sessionStorage.setItem('username', username); // Save username in session storage
        window.location.href = 'chat.html'; // Redirect to chat page
    });
}

// Function to initialize select elements and populate them with data
function initializeSelects() {
    const countrySelect = document.getElementById('country-select'); // Select element for countries
    const competitionSelect = document.getElementById('competition-select'); // Select element for competitions
    const clubSelect = document.getElementById('club-select'); // Select element for clubs
    const playerSelect = document.getElementById('player-select'); // Select element for players
    const clubInfoContainer = document.getElementById('club-info-container'); // Container for club info

    // Flags to check if data has already been loaded
    let countriesLoaded = false;
    let competitionsLoaded = false;
    let clubsLoaded = false;
    let playersLoaded = false;

    // Disable all select elements except the first one initially
    competitionSelect.disabled = true;
    clubSelect.disabled = true;
    playerSelect.disabled = true;

    // Fetch countries when the country select is clicked (only once)
    countrySelect.addEventListener('click', async function () {
        standingsCache = {}; // Clear the standings cache
        currentCompetitionId = null; // Reset current competition ID

        // Check if countries are already loaded
        if (!countriesLoaded) {
            try {
                const response = await axios.get(`/server8090/competitions/country`); // Fetch countries from API
                displayOptions(countrySelect, response.data); // Populate country select with fetched data
                countriesLoaded = true; // Set flag indicating countries have been loaded
            } catch (error) {
                console.error('Error fetching countries:', error);
                alert('Error fetching countries. Please try again later.'); // Show error message to the user
            }
        }
    });

    // Event handler for when a country is selected
    countrySelect.addEventListener('change', async function () {
        const selectedCountry = this.value; // Get the currently selected country

        standingsCache = {}; // Clear the standings cache
        currentCompetitionId = null; // Reset current competition ID

        const standingPrompt = document.getElementById('standing-prompt'); // Get the standings prompt
        if (standingPrompt) {
            standingPrompt.style.display = 'none'; // Hide the standings prompt when changing country
        }

        // Show or hide news container based on country selection
        const startingContainer = document.querySelector('.center-content');
        if (selectedCountry) {
            startingContainer.style.display = 'none'; // Hide the news container
        } else {
            startingContainer.style.display = 'block'; // Show the news container if no country is selected
        }

        // Reset options in dependent select elements
        competitionSelect.innerHTML = '<option value="">Select Competition</option>';
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';
        clubSelect.disabled = true; // Disable club select
        playerSelect.disabled = true; // Disable player select
        competitionSelect.disabled = !selectedCountry; // Enable competition select if a country is selected

        // Reset loading flags for competitions, clubs, and players
        competitionsLoaded = false;
        clubsLoaded = false;
        playersLoaded = false;

        // Fetch competitions based on the selected country
        if (selectedCountry) {
            await fetchCompetitions(selectedCountry);
        }else{
            const cardContainer = document.getElementById('card-container'); // Get the container for cards
            cardContainer.innerHTML = ''; // Clear existing cards
            //reset the initial layout
            const startingContainer = document.querySelector('.center-content');
            startingContainer.style.display = 'block'; // Show the news container
            startingContainer.style.caretColor = 'transparent';
            startingContainer.style.display = 'flex';
            startingContainer.style.flexDirection = 'column';
            startingContainer.style.justifyContent = 'center';
            startingContainer.style.alignItems = 'center';
            startingContainer.style.height = '70vh';
            startingContainer.style.textAlign = 'center';
            startingContainer.style.padding = '20px';
        }
    });

    // Event handler for competition select (on click)
    competitionSelect.addEventListener('click', async function () {
        // Check if competitions have already been loaded
        if (!competitionsLoaded && countrySelect.value) {
            const selectedCountry = countrySelect.value; // Get the currently selected country
            try {
                const response = await axios.get(`/server8090/${selectedCountry}/competitions`); // Fetch competitions from API
                displayOptions(competitionSelect, response.data, 'competition_id', 'name'); // Populate competitions select
                competitionsLoaded = true; // Indicate that competitions are loaded
            } catch (error) {
                console.error('Error fetching competitions:', error);
                alert('Error fetching competitions. Please try again later.'); // Show error message
            }
        }
    });

    // Event handler for competition select (on change)
    competitionSelect.addEventListener('change', async function () {
        const selectedCompetition = this.value; // Get the selected competition

        let standingPrompt = document.getElementById('standing-prompt'); // Get the standings prompt
        if (!standingPrompt) {
            // Create standings prompt if it does not exist
            standingPrompt = document.createElement('div');
            standingPrompt.id = 'standing-prompt';
            standingPrompt.classList.add('standing-prompt');
            standingPrompt.innerHTML = `
                <div class="standing-prompt-header">
                    <span>Want to see the standing?</span>
                    <span class="toggle-arrow">&#x25BC;</span>
                </div>
                <div class="standings-container" style="display: none;"></div>
            `;
            document.querySelector('.inline-container').insertAdjacentElement('afterend', standingPrompt); // Insert after inline-container
        } else {
            standingPrompt.style.display = 'block'; // Show the standings prompt
            standingPrompt.querySelector('.standings-container').innerHTML = ''; // Clear previous standings
            standingPrompt.querySelector('.standings-container').style.display = 'none'; // Hide the standings container
            standingPrompt.querySelector('.toggle-arrow').innerHTML = '&#x25BC;'; // Reset arrow to down position
        }

        // Clear and update club and player selects based on competition selection
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';
        clubSelect.disabled = !selectedCompetition; // Enable for valid selection
        playerSelect.disabled = true; // Disable player select initially

        // Hide club info container initially
        clubInfoContainer.style.display = 'none';
        clubsLoaded = false; // Reset loading flags for clubs

        // Toggle standings visibility
        standingPrompt.querySelector('.toggle-arrow').onclick = async function () {
            const standingsContainer = standingPrompt.querySelector('.standings-container');
            if (standingsContainer.style.display === 'none') {
                standingsContainer.style.display = 'block'; // Show standings container
                await displayStandings(selectedCompetition); // Fetch and display standings
                this.innerHTML = '&#x25B2;'; // Change arrow to up
            } else {
                standingsContainer.style.display = 'none'; // Hide standings container
                standingsCache = {}; // Clear the standings cache
                currentCompetitionId = null; // Reset current competition ID
                this.innerHTML = '&#x25BC;'; // Change arrow to down
            }
        };

        // Fetch clubs for the selected competition
        if (selectedCompetition) {
            await fetchClubs(selectedCompetition);
        }else{
            const cardContainer = document.getElementById('card-container'); // Get the container for cards
            cardContainer.innerHTML = ''; // Clear existing cards
            standingPrompt.style.display = 'none'; // Hide the standing prompt
        }
    });

    // Event handler for club select (on click)
    clubSelect.addEventListener('click', async function () {
        if (!clubsLoaded && competitionSelect.value) { // Load clubs if not already loaded
            const selectedCompetition = competitionSelect.value; // Get the selected competition
            try {
                const response = await axios.get(`/server8090/${selectedCompetition}/clubs`); // Fetch clubs from API
                if (response.data && response.data.length > 0) {
                    displayOptions(clubSelect, response.data, 'club_id', 'name'); // Populate clubs select
                    clubsLoaded = true; // Mark clubs as loaded
                } else {
                    // If no clubs, fallback to fetching games
                    const gamesResponse = await axios.get(`/server8091/api/games/competition/${selectedCompetition}`);
                    if (gamesResponse.data && gamesResponse.data.length > 0) {
                        const cardContainer = document.getElementById('card-container'); // Get the container for cards
                        cardContainer.innerHTML = ''; // Clear existing cards
                        gamesResponse.data.forEach(game => {
                            const matchDetailsRow = createMatchDetailsRow(game); // Create match row for each game
                            cardContainer.appendChild(matchDetailsRow); // Append rows to card container
                        });
                        cardContainer.style.display = 'flex'; // Display card container
                        cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
                        cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
                    }
                }
            } catch (error) {
                console.error('Error fetching clubs:', error);
                alert('Error fetching clubs. Please try again later.'); // Show error message
            }
        }
    });

    // Event handler for club select (on change)
    clubSelect.addEventListener('change', async function () {
        const standingPrompt = document.getElementById('standing-prompt');
        if (standingPrompt) {
            standingPrompt.style.display = 'none'; // Hide the standing prompt
        }
        const selectedClub = this.value; // Get the selected club
        playerSelect.innerHTML = '<option value="">Select Player</option>'; // Reset player select options
        playerSelect.disabled = true; // Disable player select

        // Fetch players for the selected club
        if (selectedClub) {
            await fetchPlayers(selectedClub); // Fetch players
        }else{
            const cardContainer = document.getElementById('card-container'); // Get the container for cards
            cardContainer.innerHTML = ''; // Clear existing cards
            const clubInfoContainer = document.getElementById('club-info-container'); // Get the club info container
            clubInfoContainer.style.display = 'none'; // Hide club info container
        }
    });

    // Event handler for player select (on click)
    playerSelect.addEventListener('click', async function () {
        if (!playersLoaded && clubSelect.value) {
            const selectedClub = clubSelect.value; // Get selected club
            try {
                const response = await axios.get(`/server8090/${selectedClub}/players`); // Fetch players from API
                displayOptions(playerSelect, response.data, 'player_id', 'name'); // Populate player select
                playersLoaded = true; // Mark players as loaded
            } catch (error) {
                console.error('Error fetching players:', error);
                alert('Error fetching players. Please try again later.'); // Show error message
            }
        }
    });

    // Event handler for player select (on change)
    playerSelect.addEventListener('change', async function () {
        const detailsContainer = document.querySelector('.details-container'); // Get the details container
        if (detailsContainer) {
            detailsContainer.style.display = 'none'; // Hide details
        }

        const selectedPlayer = this.value; // Get the selected player
        const cardContainer = document.getElementById('card-container'); // Get the card container
        cardContainer.innerHTML = ''; // Clear existing cards
        clubInfoContainer.style.display = 'none'; // Hide club info container

        // Fetch and display the selected player as a card
        if (selectedPlayer) {
            await fetchPlayer(selectedPlayer); // Fetch player details
        }else{
            const cardContainer = document.getElementById('card-container'); // Get the container for cards
            cardContainer.innerHTML = ''; // Clear existing cards
        }
    });

    // Function to fetch competitions based on the selected country
    async function fetchCompetitions(country) {
        try {
            const response = await axios.get(`/server8090/${country}/competitions`); // Fetch competitions from API
            displayCompetitionsAsCards(response.data); // Display competitions as cards
        } catch (error) {
            console.error('Error fetching competitions:', error);
            alert('Error fetching competitions. Please try again later.'); // Show error message
        }
    }

    // Function to fetch clubs based on the selected competition
    async function fetchClubs(competition) {
        try {
            const response = await axios.get(`/server8090/${competition}/clubs`); // Fetch clubs from API
            if (response.data && response.data.length > 0) {
                displayClubsAsCards(response.data); // Display clubs as cards
            } else {
                // If no clubs found, fallback to fetching games
                const response = await axios.get(`/server8091/api/games/competition/${competition}`);
                if (response.data && response.data.length > 0) {
                    const clubSelect = document.getElementById('club-select'); // Get the club select element
                    clubSelect.disabled = true; // Disable the club select
                    const cardContainer = document.getElementById('card-container'); // Get card container
                    cardContainer.innerHTML = ''; // Clear existing cards
                    response.data.forEach(game => {
                        const matchDetailsRow = createMatchDetailsRow(game); // Create match row for each game
                        cardContainer.appendChild(matchDetailsRow); // Append rows to card container
                    });
                    cardContainer.style.display = 'flex'; // Display card container
                    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
                    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
                }
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
            alert('Error fetching clubs. Please try again later.'); // Show error message
        }
    }

    // Function to fetch players based on the selected club
    async function fetchPlayers(club) {
        try {
            const clubResponse = await axios.get(`/server8090/clubs/${club}`); // Fetch club info from API
            displayClubInfo(clubResponse.data); // Display club info

            const response = await axios.get(`/server8090/${club}/players`); // Fetch players from API
            displayPlayersAsCards(response.data); // Display players as cards
            playerSelect.disabled = false; // Enable player select
        } catch (error) {
            console.error('Error fetching players:', error);
            alert('Error fetching players. Please try again later.'); // Show error message
        }
    }

    // Function to fetch player details based on the selected player ID
    async function fetchPlayer(playerId) {
        try {
            const response = await axios.get(`/server8090/players/${playerId}`); // Fetch player details from API
            displayPlayerAsCard(response.data); // Display player details
        } catch (error) {
            console.error('Error fetching player details:', error);
            alert('Error fetching player details. Please try again later.'); // Show error message
        }
    }
}

// Function to create and display competition cards
function displayCompetitionsAsCards(competitions) {
    const cardContainer = document.getElementById('card-container'); // Get the card container
    cardContainer.innerHTML = ''; // Clear existing cards

    const detailsContainer = document.querySelector('.details-container'); // Get the details container
    if (detailsContainer) {
        detailsContainer.style.display = 'none'; // Hide details container if present
    }

    competitions.forEach(competition => {
        const card = document.createElement('div'); // Create a new card element
        card.classList.add('card'); // Add the card class

        // Create card content
        card.innerHTML = `
            <h4>${competition.name}</h4>
            <p>${competition.competition_id}</p>
            <p>${competition.country_name}</p>
        `;

        card.addEventListener('click', async function() {
            const competitionSelect = document.getElementById('competition-select'); // Select element for competitions
            competitionSelect.innerHTML = `<option value="${competition.competition_id}">${competition.name}</option>`; // Set selected competition
            competitionSelect.dispatchEvent(new Event('change')); // Trigger change event
        });

        cardContainer.appendChild(card); // Append the card to the container
    });

    const clubInfoContainer = document.getElementById('club-info-container'); // Get the club info container
    clubInfoContainer.style.display = 'none'; // Hide the club info container

    cardContainer.style.display = 'flex'; // Display card container
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to create and display club cards
function displayClubsAsCards(clubs) {
    const cardContainer = document.getElementById('card-container'); // Get the card container
    cardContainer.innerHTML = ''; // Clear existing cards

    clubs.forEach(club => {
        const card = document.createElement('div'); // Create a new card element
        card.classList.add('card'); // Add the card class

        // Create card content
        card.innerHTML = `
            <h4>${club.name}</h4>
            <p>${club.domestic_competition_id}</p>
            <p>Stadium: ${club.stadium_name}</p>
            <p>Net Transfer Value: ${club.net_transfer_value}</p>
            <p>Last season: ${club.last_season}</p>
        `;

        card.addEventListener('click', async function() {
            const clubSelect = document.getElementById('club-select'); // Select element for clubs
            clubSelect.innerHTML = `<option value="${club.club_id}">${club.name}</option>`; // Set selected club
            clubSelect.dispatchEvent(new Event('change')); // Trigger change event
        });

        cardContainer.appendChild(card); // Append the card to the container
    });

    const clubInfoContainer = document.getElementById('club-info-container'); // Get the club info container
    clubInfoContainer.style.display = 'none'; // Hide the club info container

    cardContainer.style.display = 'flex'; // Display card container
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to create and display player cards
function displayPlayersAsCards(players) {
    const cardContainer = document.getElementById('card-container'); // Get the card container
    cardContainer.innerHTML = ''; // Clear existing cards

    players.forEach(player => {
        const card = document.createElement('div'); // Create a new card element
        card.classList.add('player_card'); // Add the player_card class

        // Create card content
        card.innerHTML = `
            <img src="${player.image_url || '../images/default.png'}" alt="${player.name}" class="player-image">
            <div class="player-info">
                <h4>${player.name}</h4>
                <p>${player.position}</p>
                <p>Citizenship: ${player.country_of_citizenship}</p>
                <p>Date of birth: ${player.date_of_birth}</p>
            </div>
        `;

        card.addEventListener('click', async function() {
            const playerSelect = document.getElementById('player-select'); // Select element for players
            playerSelect.innerHTML = `<option value="${player.player_id}">${player.name}</option>`; // Set selected player
            playerSelect.dispatchEvent(new Event('change')); // Trigger change event
        });

        cardContainer.appendChild(card); // Append the card to the container
    });

    cardContainer.style.display = 'flex'; // Display card container
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to display player details as a card
function displayPlayerAsCard(player) {
    const cardContainer = document.getElementById('card-container'); // Get the card container
    cardContainer.innerHTML = ''; // Clear existing cards

    const card = document.createElement('div'); // Create a new card element
    card.classList.add('player-card-container'); // Add the player-card-container class

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
            <div class="more-info" style="display: none; margin-top: 10px;"></div>
            <button class="show-more-btn">
                <span class="tooltip">Show more info</span>
                <span class="arrow">&#x25BC;</span>
            </button>
        </div>
    `;

    cardContainer.appendChild(card); // Append the card to the container

    const showMoreBtn = card.querySelector('.show-more-btn'); // Get the show more button
    const arrowIcon = showMoreBtn.querySelector('.arrow'); // Get the arrow icon
    const moreInfoDiv = card.querySelector('.more-info'); // Get the more info div

    // Event handler for the show more button
    showMoreBtn.addEventListener('click', async function() {
        if (moreInfoDiv.style.display === 'none') {
            try {
                showLoadingSpinner(); // Show loading spinner
                const response = await axios.get(`/server8091/api/appearances/appearances/games/${player.player_id}`); // Fetch player appearances
                hideLoadingSpinner(); // Hide loading spinner
                if (response.data && response.data.length > 0) {
                    response.data.forEach(appearance => {
                        const appearanceRow = createAppearanceRow(appearance); // Create appearance row for each game
                        moreInfoDiv.appendChild(appearanceRow); // Append rows to more info div
                    });
                } else {
                    const noAppearances = document.createElement('p');
                    noAppearances.textContent = 'No info found for this player.';
                    moreInfoDiv.appendChild(noAppearances); // Add message if no info found
                }

                moreInfoDiv.style.display = 'block'; // Show more info
                arrowIcon.innerHTML = '&#x25B2;'; // Change arrow to up arrow (▲)
                showMoreBtn.querySelector('.tooltip').textContent = 'Show less info'; // Update tooltip
            } catch (error) {
                console.error('Error fetching appearance details:', error);
                alert('Error fetching appearance details. Please try again later.'); // Show error message
            }
        } else {
            moreInfoDiv.style.display = 'none'; // Hide more info
            arrowIcon.innerHTML = '&#x25BC;'; // Change arrow back to down arrow (▼)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show more info'; // Update tooltip
        }
    });
}

// Function to display appearance data in the specified layout
function createAppearanceRow(appearance) {
    const appearanceRow = document.createElement('div'); // Create appearance row
    appearanceRow.classList.add('appearance-row'); // Add class for styling

    // Fill appearance row with data
    appearanceRow.innerHTML = `
    <div class="appearance-header">
        <div class="top-left">Competition type:
            <strong>${appearance.competition_type || 'N/A'}</strong>
        </div>
        <div class="middle"> 
            <strong><span>${appearance.date || 'N/A'}</span></strong>
        </div>
        <div class="top-right"> Competition id:
            <strong>${appearance.competition_id || 'N/A'}</strong>
        </div>
    </div>
    <div class="appearance-body">
        <div class="season" style="text-align: center;">
            <strong>Season: </strong>${appearance.season || 'N/A'}
        </div>
        <div class="teams" style="display: flex; justify-content: space-between; align-items: center;">
            <strong class="home">${appearance.home_club_name || 'N/A'}</strong>
            <span class="aggregate">${appearance.aggregate || '-'}</span>
            <strong class="away">${appearance.away_club_name || 'N/A'}</strong>
        </div>
    </div>
    <div class="appearance-footer">
        <p><strong>Yellow cards: </strong>${appearance.yellow_cards || 0}</p>
        <p><strong>Red cards: </strong>${appearance.red_cards || 0}</p>
        <p><strong>Goals: </strong>${appearance.goals || 0}</p>
        <p><strong>Assists: </strong>${appearance.assists || 0}</p>
        <p><strong>Minutes played: </strong>${appearance.minutes_played || 'N/A'}</p>
    </div>
`;
    return appearanceRow; // Return the constructed appearance row
}

// Function to display club information
function displayClubInfo(club) {
    const clubInfoContainer = document.getElementById('club-info-container'); // Get the club info container
    if (!clubInfoContainer) return; // Ensure that the container exists

    clubInfoContainer.innerHTML = ''; // Clear previous content

    // Add club info to the container
    clubInfoContainer.innerHTML = `
    <div class="club-card">
        <h3 class="club-name">${club.name}</h3>
        <div class="info-row">
            <p class="average-age">Average age: <strong>${club.average_age || 'N/A'}</strong></p>
            <p class="net-transfer">Net transfer record: <strong>${club.net_transfer_record || 'N/A'}</strong></p>
        </div>
        <div class="additional-info">
            <p class="last-season">Last season: <strong>${club.last_season || 'Unknown'}</strong></p>
            <p class="stadium">Stadium: <strong>${club.stadium_name || 'Unknown'}</strong></p>
        </div>
        <div class="more-info" style="display: none; margin-top: 10px;"></div>
        <button class="show-more-btn">
            <span class="tooltip">Show more info</span>
            <span class="arrow">&#x25BC;</span>
        </button>
    </div>
    `;

    const showMoreBtn = clubInfoContainer.querySelector('.show-more-btn'); // Get the show more button
    const arrowIcon = showMoreBtn.querySelector('.arrow'); // Get the arrow icon
    const moreInfoDiv = clubInfoContainer.querySelector('.more-info'); // Get the more info div

    // Event handler for the show more button
    showMoreBtn.addEventListener('click', async function() {
        if (moreInfoDiv.style.display === 'none') {
            try {
                showLoadingSpinner(); // Show loading spinner
                const response = await axios.get(`/server8091/api/club_games/club/games/${club.club_id}`); // Fetch club games
                if (response.data && response.data.length > 0) {
                    for (const appearance of response.data) {
                        const opponent = await axios.get(`/server8090/clubs/${appearance.opponent_id}`); // Fetch opponent info
                        const games = displayClubGames(appearance, opponent.data || { name: 'unknown' }, club.name); // Display games
                        moreInfoDiv.appendChild(games); // Append games to more info div
                    }
                } else {
                    const noAppearances = document.createElement('p');
                    noAppearances.textContent = 'No info found for this club.';
                    moreInfoDiv.appendChild(noAppearances); // Add message if no info found
                }
                hideLoadingSpinner(); // Hide loading spinner
            } catch (error) {
                console.error('Error fetching appearance details:', error);
                alert('Error fetching appearance details. Please try again later.'); // Show error message
            }
            moreInfoDiv.style.display = 'block'; // Show more info
            arrowIcon.innerHTML = '&#x25B2;'; // Change to up arrow (▲)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show less info'; // Update tooltip
        } else {
            moreInfoDiv.style.display = 'none'; // Hide more info
            arrowIcon.innerHTML = '&#x25BC;'; // Change back to down arrow (▼)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show more info'; // Update tooltip
        }
    });

    clubInfoContainer.style.display = 'block'; // Show club info container
}

// Function to display options in a select element
function displayOptions(selectElement, options, valueKey, textKey) {
    selectElement.innerHTML = ''; // Clear existing options

    const defaultOption = document.createElement('option'); // Create default option
    defaultOption.value = '';
    defaultOption.textContent = `Select ${selectElement.id.replace('-select', '')}`; // Set default option text
    selectElement.appendChild(defaultOption); // Append default option to select

    console.log('options', options);
    // Populate select with provided options
    options.forEach(option => {
        const optionElement = document.createElement('option'); // Create option element
        optionElement.value = option[valueKey] || option; // Set value for the option
        optionElement.textContent = option[textKey] || option; // Set display text for the option
        selectElement.appendChild(optionElement); // Append option to select
    });
}

// Function to create and display match details
function createMatchDetailsRow(match) {
    const matchRow = document.createElement('div'); // Create match details row
    matchRow.classList.add('match-row'); // Add class for styling

    matchRow.innerHTML = `
        <div class="match-header">
            <div class="top-left">
                <strong>Competition: ${match.competition_id || 'N/A'} (${match.competition_type || 'N/A'})</strong>
            </div>
            <div class="middle">
                <strong>Date: </strong>${new Date(match.date).toLocaleDateString() || 'N/A'}
            </div>
            <div class="top-right">
                <strong>Round: ${match.round || 'N/A'}</strong>
            </div>
        </div>
        <div class="match-body">
            <div class="teams">
                <div class="team-left">
                    <strong>${match.home_club_name || 'N/A'}</strong>
                    <p>Manager: ${match.home_club_manager_name || 'N/A'}</p>
                    <p>Formation: ${match.home_club_formation || 'N/A'}</p>
                </div>
                <div class="score-center">
                    <strong>${match.home_club_goals} : ${match.away_club_goals}</strong>
                </div>
                <div class="team-right">
                    <strong>${match.away_club_name || 'N/A'}</strong>
                    <p>Manager: ${match.away_club_manager_name || 'N/A'}</p>
                    <p>Formation: ${match.away_club_formation || 'N/A'}</p>
                </div>
            </div>
        </div>
        <div class="match-footer">
            <p><strong>Stadium: </strong>${match.stadium || 'N/A'}</p>
            <p><strong>Attendance: </strong>${match.attendance || 'N/A'}</p>
            <p><strong>Referee: </strong>${match.referee || 'N/A'}</p>
        </div>
    `;
    return matchRow; // Return the created match row
}

// Function to display club games
function displayClubGames(game, opponent, clubName) {
    const gameContainer = document.createElement('div'); // Create a container for the game
    gameContainer.classList.add('game-container'); // Add class for styling

    gameContainer.dataset.homeTeamId = game.club_id; // Set home team ID
    gameContainer.dataset.awayTeamId = opponent.name ? game.opponent_id : 'unknown'; // Set away team ID
    gameContainer.dataset.gameId = game.game_id; // Set game ID

    gameContainer.innerHTML += `  
    <div class="game-header">
        <div class="team-left">
            <strong>${clubName}</strong>
            <p>Manager: <strong>${game.own_manager_name || 'N/A'}</strong></p>
            <p>Position: <strong>${game.own_position || 'N/A'}</strong></p>
        </div>
        <div class="score-center">
            <strong>${game.own_goals} : ${game.opponent_goals}</strong>
        </div>
        <div class="team-right">
            <strong>${opponent.name}</strong>
            <p>Manager: <strong>${game.opponent_manager_name || 'N/A'}</strong></p>
            <p>Position: <strong>${game.opponent_position || 'N/A'}</strong></p>
        </div>
    </div>
    <div class="game-footer">
        <p><strong>Hosting: </strong><strong>${game.hosting || 'N/A'}</strong></p>
        <div class="arrow-container">
            <span class="tooltip-right">Show more info</span>
            <span class="right-arrow">&#11208;</span> <!-- Right arrow -->
        </div>
    </div>
    `;

    // Event handler for displaying selected game details
    gameContainer.addEventListener('click', (event) => {
        event.stopPropagation();  // Prevent click from bubbling up to parent elements
        displaySelectedGameDetails(game, opponent, clubName); // Display details for the selected game
    });

    // Event handler for showing more game details
    gameContainer.querySelector('.right-arrow').addEventListener('click', (event) => {
        const playerSelect = document.querySelector('#player-select');
        playerSelect.disabled = true; // Disable player select
        event.stopPropagation(); // Prevent triggering the gameContainer click
        hideContent(clubName, opponent.name, gameContainer); // Hide other content and show game details
    });

    return gameContainer; // Return the created game container
}

// Function to hide other content when a game is selected
function hideContent(homeTeam, awayTeam, gameContainer) {
    const centerContent = document.querySelector('.center-content'); // Get the center content element
    const clubInfoContainer = document.getElementById('club-info-container'); // Get club info container
    const cardContainer = document.getElementById('card-container'); // Get card container
    const appearancesContainer = document.getElementById('appearancesContainer'); // Get appearances container

    centerContent.style.display = 'none'; // Hide center content
    clubInfoContainer.style.display = 'none'; // Hide club info
    cardContainer.style.display = 'none'; // Hide card container
    appearancesContainer.style.display = 'none'; // Hide appearances container

    displaySelectedGameDetails(gameContainer, homeTeam, awayTeam); // Show selected game details
}

// Async function to display selected game details
async function displaySelectedGameDetails(gameContainer, homeTeam, awayTeam) {
    const gameID = gameContainer.dataset.gameId; // Get the game ID
    const scoreCenterDiv = gameContainer.querySelector('.score-center'); // Get score center div
    const scoreContent = scoreCenterDiv.textContent; // Get score content

    try {
        showLoadingSpinner(); // Show loading spinner

        const response = await axios.get(`/server8091/api/game_events/game/${gameID}`); // Fetch game events
        const gameEvents = response.data; // Get game events data

        const existingDetailsContainer = document.querySelector('.details-container'); // Check for existing detail containers
        if (existingDetailsContainer) {
            existingDetailsContainer.remove(); // Remove existing details if present
        }

        const detailsContainer = document.createElement('div'); // Create a new details container
        detailsContainer.classList.add('details-container');

        const container = document.createElement('div'); // Create a container for game details
        container.classList.add('game-details-container');

        const scoreContainer = document.createElement('div'); // Create a score container
        scoreContainer.classList.add('score-container');

        const homeColumn = createTeamEventsColumn(gameEvents, homeTeam); // Create home team events column
        const awayColumn = createTeamEventsColumn(gameEvents, awayTeam); // Create away team events column

        container.appendChild(homeColumn); // Append home column to details container
        container.appendChild(awayColumn); // Append away column to details container

        const scoreDiv = document.createElement('div'); // Create a div for displaying score
        scoreDiv.classList.add('game-score');
        scoreDiv.textContent = scoreContent; // Set text for score div

        scoreContainer.appendChild(scoreDiv); // Append score div to score container
        detailsContainer.appendChild(scoreContainer); // Append score container to details container
        detailsContainer.appendChild(container); // Append complete game details to overall container

        document.body.appendChild(detailsContainer); // Append details to body

        await displayInfoGame(gameContainer, homeColumn, awayColumn); // Display formations for teams

        hideLoadingSpinner(); // Hide loading spinner
    } catch (error) {
        console.error('Error fetching game events:', error);
    }
}

// Function to create a column for team events in the game
function createTeamEventsColumn(gameEvents, teamName) {
    const teamColumn = document.createElement('div'); // Create a column for the team
    teamColumn.classList.add('team-column'); // Add class for styling

    const teamHeading = document.createElement('h2'); // Create a heading for the team
    teamHeading.textContent = teamName; // Set the team name as heading
    teamColumn.appendChild(teamHeading); // Append heading to the team column

    // Defensive check for game events
    if (!Array.isArray(gameEvents)) {
        console.error('gameEvents is not an array:', gameEvents);
        return teamColumn; // Return empty column if gameEvents is not an array
    }

    gameEvents.forEach(event => {
        // Check for event.club_name
        if (event.club_name && event.club_name.toLowerCase() === teamName.toLowerCase()) {
            const eventElement = document.createElement('p'); // Create element for the event
            // Handling different event types
            if (event.type === 'Goals') {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;⚽ Goal: <strong>${event.player_name}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            } else if (event.type === 'Substitutions') {
                eventElement.classList.add('substitution-event'); // Add class for substitution events
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;🔄 Substitution: <strong>${event.player_name}</strong> substituted by <strong>${event.player_in_id}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            } else if (event.type === 'Cards') {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;🟨🟥 Card: <strong>${event.player_name}</strong> received a card<br>&emsp;Description <strong>${event.description}</strong>`;
            } else {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;Player: <strong>${event.player_name}</strong> <br>&emsp;Type: <strong>${event.type}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            }
            teamColumn.appendChild(eventElement); // Append event element to the team column
        }
    });

    return teamColumn; // Return the completed team events column
}

// Async function to display formations for teams
async function displayInfoGame(gameContainer, homeColumn, awayColumn) {
    const homeTeamId = gameContainer.dataset.homeTeamId; // Get home team ID
    const awayTeamId = gameContainer.dataset.awayTeamId; // Get away team ID
    const gameID = gameContainer.dataset.gameId; // Get game ID

    try {
        const homeFormation = document.createElement('div'); // Create a div for the home team's formation
        homeFormation.classList.add('formation');

        if (homeTeamId !== 'unknown') {
            const responseHome = await axios.get(`/server8091/api/game_lineups/game/${gameID}/${homeTeamId}`); // Fetch home team lineup
            if (responseHome.data && responseHome.data.length > 0) {
                responseHome.data.forEach(player => {
                    const playerInfo = document.createElement('p'); // Create an element for each player
                    playerInfo.innerHTML = `
                        Type: ${player.type} <br>
                        Number: ${player.number} <br>
                        Player: ${player.player_name} <br>
                        Position: ${player.position}
                        ${player.team_captain === 1 ? '<br>Captain' : ''}
                    `;
                    homeFormation.appendChild(playerInfo); // Append player info to home formation
                });
            } else {
                homeFormation.textContent = 'No formation found'; // Message if no formation found
            }
        } else {
            homeFormation.textContent = 'No formation found'; // Message if no formation found
        }
        homeColumn.appendChild(homeFormation); // Append home formation to its column

        const awayFormation = document.createElement('div'); // Create a div for away team's formation
        awayFormation.classList.add('formation');

        if (awayTeamId !== 'unknown') {
            const responseAway = await axios.get(`/server8091/api/game_lineups/game/${gameID}/${awayTeamId}`); // Fetch away team lineup
            if (responseAway.data && responseAway.data.length > 0) {
                responseAway.data.forEach(player => {
                    const playerInfo = document.createElement('p'); // Create an element for each player
                    playerInfo.innerHTML = `
                        Type: ${player.type} <br>
                        Number: ${player.number} <br>
                        Player: ${player.player_name} <br>
                        Position: ${player.position}
                        ${player.team_captain === 1 ? '<br>Captain' : ''}
                    `;
                    awayFormation.appendChild(playerInfo); // Append player info to away formation
                });
            } else {
                awayFormation.textContent = 'No formation found'; // Message if no formation found
            }
        } else {
            awayFormation.textContent = 'No formation found'; // Message if no formation found
        }
        awayColumn.appendChild(awayFormation); // Append away formation to its column

    } catch (error) {
        console.error('Error fetching formation data:', error);
    }
}

// Function to show loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner'); // Get loading spinner element
    if (spinner) spinner.classList.remove('hidden'); // Show spinner if it exists
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner'); // Get loading spinner element
    if (spinner) spinner.classList.add('hidden'); // Hide spinner if it exists
}

// Function to display standings for the selected competition
async function displayStandings(competition_id) {
    const standingPrompt = document.getElementById('standing-prompt'); // Get standings prompt
    const standingsContainer = standingPrompt.querySelector('.standings-container'); // Get standings container
    standingsContainer.style.display = 'none'; // Hide the standings container initially

    if (currentCompetitionId !== competition_id) {
        standingsCache = {}; // Clear the standings cache
        currentCompetitionId = competition_id; // Update current competition ID
    }

    try {
        if (standingsCache[competition_id]) { // Check if standings are already cached
            console.log('Using session cache for standings');
            renderStandings(standingsCache[competition_id]); // Render standings from cache
            standingsContainer.style.display = 'block'; // Show standings container
            return;
        }

        // Fetch the standings from API
        const response = await axios.get(`/server8091/api/games/standings/${competition_id}`);

        standingsCache[competition_id] = response.data; // Cache the fetched standings data
        renderStandings(response.data); // Render the fetched standings data
        standingsContainer.style.display = 'block'; // Show standings container

    } catch (error) {
        hideLoadingSpinner(); // Hide spinner on error
        console.error('Error fetching standings:', error); // Log error
        standingsContainer.innerHTML = '<p>No standings found for this competition.</p>'; // Show no standings found message
    }
}

// Function to render standings in the UI
function renderStandings(standingsData) {
    const standingsContainer = document.querySelector('.standings-container'); // Get standings container
    standingsContainer.innerHTML = '';  // Clear previous standings

    if(standingsData.length === 0) {
        standingsContainer.innerHTML = '<p>No standings found for this competition.</p>'; // Show no standings found message
        return;
    }
    standingsData.forEach(round => {
        const roundDiv = document.createElement('div'); // Create round container
        roundDiv.classList.add('round-container'); // Add class for styling

        const roundHeader = document.createElement('div'); // Create round header
        roundHeader.classList.add('round-header');
        roundHeader.innerHTML = `
            <span>${round.round}</span>
            <span class="right-arrow">&#11208;</span>`;

        const teamsDiv = document.createElement('div'); // Create teams container
        teamsDiv.classList.add('teams-container');
        teamsDiv.style.display = 'none'; // Initially hide teams

        round.teams.forEach(team => {
            const teamDiv = document.createElement('div'); // Create element for each team
            teamDiv.classList.add('team-item');
            teamDiv.textContent = team.position ? `${team.position}° ${team.name}` : team.name; // Set team text
            teamsDiv.appendChild(teamDiv); // Append team to teams container
        });

        roundDiv.appendChild(roundHeader); // Append header to round
        roundDiv.appendChild(teamsDiv); // Append teams to round
        standingsContainer.appendChild(roundDiv); // Append round to standings container

        // Toggle team visibility on header click
        roundHeader.addEventListener('click', () => {
            const isVisible = teamsDiv.style.display === 'block'; // Check if teams are visible
            teamsDiv.style.display = isVisible ? 'none' : 'block'; // Toggle visibility
            roundHeader.querySelector('.right-arrow').innerHTML = isVisible ? '&#11208;' : '&#11205;'; // Toggle arrow direction
        });
    });
}