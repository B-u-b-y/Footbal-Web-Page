document.addEventListener('DOMContentLoaded', async function () {
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
    const clubInfoContainer = document.getElementById('club-info-container');

    let countriesLoaded = false;
    let competitionsLoaded = false;
    let clubsLoaded = false;
    let playersLoaded = false;

    // Initially disable all selects except the first one
    competitionSelect.disabled = true;
    clubSelect.disabled = true;
    playerSelect.disabled = true; // Disable player select initially

    // Fetch countries when the country select is clicked (only once)
    countrySelect.addEventListener('click', async function () {

        if (!countriesLoaded) {
            try {
                const response = await axios.get(`/server8090/competitions/country`);
                displayOptions(countrySelect, response.data);
                countriesLoaded = true;
            } catch (error) {
                console.error('Error fetching countries:', error);
                alert('Error fetching countries. Please try again later.');
            }
        }
    });

    // Event handler for country select (on change)
    countrySelect.addEventListener('change', async function () {
        const selectedCountry = this.value;

        const starting_container = document.querySelector('.center-content');
        if (selectedCountry) {
            starting_container.style.display = 'none'; // Hide the news container
        } else {
            starting_container.style.display = 'block'; // Show the news container if no country is selected
        }

        // Clear dependent selects when country changes
        competitionSelect.innerHTML = '<option value="">Select Competition</option>';
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';
        clubSelect.disabled = true;
        playerSelect.disabled = true;
        competitionSelect.disabled = !selectedCountry;

        // Reset loading flags
        competitionsLoaded = false; // Reset to allow fetching again
        clubsLoaded = false; // Reset to allow fetching again
        playersLoaded = false; // Reset to allow fetching again

        // Fetch competitions for the selected country
        if (selectedCountry) {
            await fetchCompetitions(selectedCountry);
        }
    });

    // Event handler for competition select (on click)
    competitionSelect.addEventListener('click', async function () {
        if (!competitionsLoaded && countrySelect.value) {
            const selectedCountry = countrySelect.value;
            try {
                const response = await axios.get(`/server8090/${selectedCountry}/competitions`);
                displayOptions(competitionSelect, response.data, 'competition_id', 'name');
                competitionsLoaded = true;
            } catch (error) {
                console.error('Error fetching competitions:', error);
                alert('Error fetching competitions. Please try again later.');
            }
        }
    });

    // Event handler for competition select (on change)
    competitionSelect.addEventListener('change', async function () {
        const selectedCompetition = this.value;

        // Clear club select and player select
        clubSelect.innerHTML = '<option value="">Select Club</option>';
        playerSelect.innerHTML = '<option value="">Select Player</option>';
        clubSelect.disabled = !selectedCompetition;
        playerSelect.disabled = true;

        clubInfoContainer.style.display = 'none'; // Hide the club info container
        // Reset loading flags
        clubsLoaded = false; // Reset to allow fetching again

        // Fetch clubs for the selected competition
        if (selectedCompetition) {
            await fetchClubs(selectedCompetition);
        }
    });

    // Event handler for club select (on click)
    clubSelect.addEventListener('click', async function () {
        if (!clubsLoaded && competitionSelect.value) {
            const selectedCompetition = competitionSelect.value;
            try {
                const response = await axios.get(`/server8090/${selectedCompetition}/clubs`);
                if(response.data && response.data.length > 0) {
                    displayOptions(clubSelect, response.data, 'club_id', 'name');
                    clubsLoaded = true;
                } else {
                    const response = await axios.get(`/server8091/api/games/competition/${selectedCompetition}`);
                    if(response.data && response.data.length > 0) {
                        const cardContainer = document.getElementById('card-container');
                        cardContainer.innerHTML = ''; // Clear existing cards
                        response.data.forEach(game => {
                            const matchDetailsRow = createMatchDetailsRow(game);
                            cardContainer.appendChild(matchDetailsRow); // Append rows directly to cardContainer
                        });
                        cardContainer.style.display = 'flex';
                        cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
                        cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
                    }
                }
            } catch (error) {
                console.error('Error fetching clubs:', error);
                alert('Error fetching clubs. Please try again later.');
            }
        }
    });

    // Event handler for club select (on change)
    clubSelect.addEventListener('change', async function () {
        const selectedClub = this.value;
        playerSelect.innerHTML = '<option value="">Select Player</option>';
        playerSelect.disabled = true;

        // Reset loading flag
        playersLoaded = false; // Reset to allow fetching again
        // Fetch players for the selected club
        if (selectedClub) {
            await fetchPlayers(selectedClub);
        }
    });

    // Event handler for player select (on click)
    playerSelect.addEventListener('click', async function () {
        if (!playersLoaded && clubSelect.value) {
            const selectedClub = clubSelect.value;
            try {
                const response = await axios.get(`/server8090/${selectedClub}/players`);
                displayOptions(playerSelect, response.data, 'player_id', 'name');
                playersLoaded = true;
            } catch (error) {
                console.error('Error fetching players:', error);
                alert('Error fetching players. Please try again later.');
            }
        }
    });

    // Event handler for player select (on change)
    playerSelect.addEventListener('change', async function () {
        const details_container = document.querySelector('.details-container');
        if(details_container){
            details_container.style.display = 'none';
        }

        const selectedPlayer = this.value;

        // Clear existing cards in card-container
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = ''; // Clear existing cards
        clubInfoContainer.style.display = 'none'; // Hide the club info container

        // Fetch and display the selected player as a card
        if (selectedPlayer) {
            await fetchPlayer(selectedPlayer);
        }
    });

    // Fetch competitions for the selected country
    async function fetchCompetitions(country) {
        try {
            const response = await axios.get(`/server8090/${country}/competitions`);
            displayCompetitionsAsCards(response.data);
        } catch (error) {
            console.error('Error fetching competitions:', error);
            alert('Error fetching competitions. Please try again later.');
        }
    }

    // Fetch clubs for the selected competition
    async function fetchClubs(competition) {
        try {
            const response = await axios.get(`/server8090/${competition}/clubs`);
            if (response.data && response.data.length > 0) {
                displayClubsAsCards(response.data);
            }else{
                const response = await axios.get(`/server8091/api/games/competition/${competition}`);
                if(response.data && response.data.length > 0) {
                    const clubSelect = document.getElementById('club-select');
                    clubSelect.disabled = true;
                    const cardContainer = document.getElementById('card-container');
                    cardContainer.innerHTML = ''; // Clear existing cards
                    response.data.forEach(game => {
                        const matchDetailsRow = createMatchDetailsRow(game);
                        cardContainer.appendChild(matchDetailsRow); // Append rows directly to cardContainer
                    });
                    cardContainer.style.display = 'flex';
                    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
                    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
                }
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
            alert('Error fetching clubs. Please try again later.');
        }
    }

    // Fetch players for the selected club
    async function fetchPlayers(club) {
        try {
            const clubResponse = await axios.get(`/server8090/clubs/${club}`);
            displayClubInfo(clubResponse.data);

            const response = await axios.get(`/server8090/${club}/players`);
            displayPlayersAsCards(response.data);

            playerSelect.disabled = false; // Enable player select
        } catch (error) {
            console.error('Error fetching players:', error);
            alert('Error fetching players. Please try again later.');
        }
    }

    // Fetch player details based on selected player ID
    async function fetchPlayer(playerId) {
        try {
            const response = await axios.get(`/server8090/players/${playerId}`);
            displayPlayerAsCard(response.data);
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

    const details_container = document.querySelector('.details-container');
    if(details_container){
        details_container.style.display = 'none';
    }

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

    const club_info_container = document.getElementById('club-info-container');
    club_info_container.style.display = 'none'; // Hide the club info container

    // Ensure cardContainer is displayed as flex and adjusts accordingly
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to create and display club cards
function displayClubsAsCards(clubs) {
    const cardContainer = document.getElementById('card-container');
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

    const club_info_container = document.getElementById('club-info-container');
    club_info_container.style.display = 'none'; // Hide the club info container

    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to create and display player cards
function displayPlayersAsCards(players) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear existing cards

    players.forEach(player => {
        const card = document.createElement('div');
        card.classList.add('player_card');

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

        cardContainer.appendChild(card); // Append the card to the container
    });

    // Ensure cards are displayed correctly with CSS
    cardContainer.style.display = 'flex';
    cardContainer.style.flexDirection = 'row'; // Arrange cards in a row
    cardContainer.style.flexWrap = 'wrap'; // Allow wrapping for cards
}

// Function to display player details as a card
function displayPlayerAsCard(player) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('player-card-container');

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

    cardContainer.appendChild(card);

    const showMoreBtn = card.querySelector('.show-more-btn');
    const arrowIcon = showMoreBtn.querySelector('.arrow');
    const moreInfoDiv = card.querySelector('.more-info');

    showMoreBtn.addEventListener('click', async function() {
        if (moreInfoDiv.style.display === 'none') {
            try {
                showLoadingSpinner();
                const response = await axios.get(`/server8091/api/appearances/appearances/games/${player.player_id}`);
                hideLoadingSpinner();
                if(response.data && response.data.length > 0) {
                    // Loop through each appearance and append the row to moreInfoDiv
                    response.data.forEach(appearance => {
                        const appearanceRow = createAppearanceRow(appearance);
                        moreInfoDiv.appendChild(appearanceRow); // Append rows directly to moreInfoDiv
                    });
                }else{
                    const noAppearances = document.createElement('p');
                    noAppearances.textContent = 'No info found for this player.';
                    moreInfoDiv.appendChild(noAppearances);
                }

                moreInfoDiv.style.display = 'block';
                arrowIcon.innerHTML = '&#x25B2;'; // Change to up arrow (▲)
                showMoreBtn.querySelector('.tooltip').textContent = 'Show less info';
            } catch (error) {
                console.error('Error fetching appearance details:', error);
                alert('Error fetching appearance details. Please try again later.');
            }
        } else {
            moreInfoDiv.style.display = 'none';
            arrowIcon.innerHTML = '&#x25BC;'; // Change back to down arrow (▼)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show more info';
        }
    });
}

// Function to display appearance data in the specified layout
function createAppearanceRow(appearance) {
    // Create a container div for the appearance row
    const appearanceRow = document.createElement('div');
    appearanceRow.classList.add('appearance-row');

    // Create and append elements in the specified order
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
    return appearanceRow;
}


function displayClubInfo(club) {
    const clubInfoContainer = document.getElementById('club-info-container');

    // Clear any previous content
    clubInfoContainer.innerHTML = '';

    // Insert the club info into the new container with a Show More button
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

    // Add event listener for Show More button
    const showMoreBtn = clubInfoContainer.querySelector('.show-more-btn');
    const arrowIcon = showMoreBtn.querySelector('.arrow');
    const moreInfoDiv = clubInfoContainer.querySelector('.more-info');

    showMoreBtn.addEventListener('click', async function() {
        if (moreInfoDiv.style.display === 'none') {
            try{
                showLoadingSpinner();
                const response = await axios.get(`/server8091/api/club_games/club/games/${club.club_id}`);
                if(response.data && response.data.length > 0) {
                    // Loop through each appearance and append the row to moreInfoDiv
                    for (const appearance of response.data) {
                        const opponent = await axios.get(`/server8090/clubs/${appearance.opponent_id}`);
                        if(!opponent.data) {
                            opponent.data = 'unknown';
                        }
                        const games = displayClubGames(appearance, opponent.data, club.name);
                        moreInfoDiv.appendChild(games); // Append rows directly to moreInfoDiv
                    }
                }else{
                    const noAppearances = document.createElement('p');
                    noAppearances.textContent = 'No info found for this club.';
                    moreInfoDiv.appendChild(noAppearances);
                }
                hideLoadingSpinner();
            }catch (error){
                console.error('Error fetching appearance details:', error);
                alert('Error fetching appearance details. Please try again later.');
            }
            moreInfoDiv.style.display = 'block';
            arrowIcon.innerHTML = '&#x25B2;'; // Change to up arrow (▲)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show less info';
        } else {
            moreInfoDiv.style.display = 'none';
            arrowIcon.innerHTML = '&#x25BC;'; // Change back to down arrow (▼)
            showMoreBtn.querySelector('.tooltip').textContent = 'Show more info';
        }
    });

    clubInfoContainer.style.display = 'block';
}

// Function to display options in a select element
function displayOptions(selectElement, options, valueKey, textKey) {
    selectElement.innerHTML = ''; // Clear existing options

    // Add the default "Select" option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `Select ${selectElement.id.replace('-select', '')}`;
    selectElement.appendChild(defaultOption);

    options.forEach(option => {
        const optionElement = document.createElement('option');
        if (valueKey === undefined && textKey === undefined) {
            optionElement.value = option;
            optionElement.textContent = option;
        } else {
            optionElement.value = option[valueKey];
            optionElement.textContent = option[textKey];
        }
        selectElement.appendChild(optionElement);
    });
}

function createMatchDetailsRow(match) {
    // Create a container div for the match details
    const matchRow = document.createElement('div');
    matchRow.classList.add('match-row');

    // Structure the match data into HTML format
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

    return matchRow;
}

function displayClubGames(game, opponent, clubName) {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');

    // Add data attributes for team IDs
    gameContainer.dataset.homeTeamId = game.club_id;

    // Check if opponent is undefined or 'unknown'
    if (opponent === undefined || opponent === 'unknown') {
        gameContainer.dataset.awayTeamId = 'unknown';
        opponent = { name: 'unknown' }; // Assign an object to opponent with name property
    } else {
        gameContainer.dataset.awayTeamId = game.opponent_id; // Use the actual opponent ID
    }

    gameContainer.dataset.gameId = game.game_id;

    // HTML structure for game details
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

    // Add click event to display selected game details
    gameContainer.addEventListener('click', (event) => {
        event.stopPropagation();  // Prevent click from bubbling up
        displaySelectedGameDetails(game, opponent, clubName);
    });

    // Add click event for the arrow to show game details
    gameContainer.querySelector('.right-arrow').addEventListener('click', (event) => {
        const player_select = document.querySelector('#player-select');
        player_select.disabled = true;
        event.stopPropagation(); // Prevent triggering the gameContainer click
        hideContent(clubName, opponent.name, gameContainer);
    });

    return gameContainer;
}


// Function to hide content except topnav and inline-container
function hideContent(homeTeam, awayTeam, gameContainer) {
    const centerContent = document.querySelector('.center-content');
    const clubInfoContainer = document.getElementById('club-info-container');
    const cardContainer = document.getElementById('card-container');
    const appearancesContainer = document.getElementById('appearancesContainer');

    centerContent.style.display = 'none';
    clubInfoContainer.style.display = 'none';
    cardContainer.style.display = 'none';
    appearancesContainer.style.display = 'none';

    displaySelectedGameDetails(gameContainer, homeTeam, awayTeam);
}

async function displaySelectedGameDetails(gameContainer, homeTeam, awayTeam) {
    const gameID = gameContainer.dataset.gameId;

    // Access the score-center div
    const scoreCenterDiv = gameContainer.querySelector('.score-center');
    const scoreContent = scoreCenterDiv.textContent;

    try {
        const response = await axios.get(`/server8091/api/game_events/game/${gameID}`);
        const gameEvents = response.data;

        // Check if a details container already exists
        const existingDetailsContainer = document.querySelector('.details-container');
        if (existingDetailsContainer) {
            existingDetailsContainer.remove();
        }

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container');

        const container = document.createElement('div');
        container.classList.add('game-details-container');

        const scoreContainer = document.createElement('div'); // New score container
        scoreContainer.classList.add('score-container');

        const homeColumn = createTeamEventsColumn(gameEvents, homeTeam);
        const awayColumn = createTeamEventsColumn(gameEvents, awayTeam);

        container.appendChild(homeColumn);
        container.appendChild(awayColumn);

        const scoreDiv = document.createElement('div');
        scoreDiv.classList.add('game-score');
        scoreDiv.textContent = scoreContent;

        scoreContainer.appendChild(scoreDiv); // Append scoreDiv to scoreContainer
        detailsContainer.appendChild(scoreContainer); // Append scoreContainer to detailsContainer
        detailsContainer.appendChild(container);

        document.body.appendChild(detailsContainer);

        await displayFormation(gameContainer, homeColumn, awayColumn);

    } catch (error) {
        console.error('Error fetching game events:', error);
    }
}

function createTeamEventsColumn(gameEvents, teamName) {
    const teamColumn = document.createElement('div');
    teamColumn.classList.add('team-column');

    const teamHeading = document.createElement('h2');
    teamHeading.textContent = teamName;
    teamColumn.appendChild(teamHeading);

    // Defensive check for gameEvents
    if (!Array.isArray(gameEvents)) {
        console.error('gameEvents is not an array:', gameEvents);
        return teamColumn; // or handle as needed
    }

    gameEvents.forEach(event => {
        // Check for event.club_name
        if (event.club_name && event.club_name.toLowerCase() === teamName.toLowerCase()) {
            const eventElement = document.createElement('p');

            // Handling different event types
            if (event.type === 'Goals') {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;⚽ Goal: <strong>${event.player_name}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            } else if (event.type === 'Substitutions') {
                eventElement.classList.add('substitution-event');
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;🔄 Substitution: <strong>${event.player_name}</strong> substituted by <strong>${event.player_in_id}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            } else if (event.type === 'Cards') {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;🟨🟥 Card: <strong>${event.player_name}</strong> received a card<br>&emsp;Description <strong>${event.description}</strong>`;
            } else {
                eventElement.innerHTML = `Minute: <strong>${event.minute}</strong> <br>&emsp;Player: <strong>${event.player_name}</strong> <br>&emsp;Type: <strong>${event.type}</strong><br>&emsp;Description <strong>${event.description}</strong>`;
            }
            teamColumn.appendChild(eventElement);
        }
    });

    return teamColumn;
}

async function displayFormation(gameContainer, homeColumn, awayColumn) {
    const homeTeamId = gameContainer.dataset.homeTeamId;
    const awayTeamId = gameContainer.dataset.awayTeamId;
    const gameID = gameContainer.dataset.gameId;

    try {
        // Fetch formation for the home team
        const homeFormation = document.createElement('div');
        homeFormation.classList.add('formation');

        if (homeTeamId !== 'unknown') {
            const response_home = await axios.get(`/server8091/api/game_lineups/game/${gameID}/${homeTeamId}`);
            if (response_home.data && response_home.data.length > 0) {
                response_home.data.forEach(player => {
                    const playerInfo = document.createElement('p');
                    playerInfo.innerHTML = `
                        Type: ${player.type} <br>
                        Number: ${player.number} <br>
                        Player: ${player.player_name} <br>
                        Position: ${player.position}
                        ${player.team_captain === 1 ? '<br>Captain' : ''}
                    `;
                    homeFormation.appendChild(playerInfo);
                });
            } else {
                homeFormation.textContent = 'No formation found';
            }
        } else {
            homeFormation.textContent = 'No formation found';
        }
        homeColumn.appendChild(homeFormation);

        // Fetch formation for the away team
        const awayFormation = document.createElement('div');
        awayFormation.classList.add('formation');

        if (awayTeamId !== 'unknown') {
            const response_away = await axios.get(`/server8091/api/game_lineups/game/${gameID}/${awayTeamId}`);
            if (response_away.data && response_away.data.length > 0) {
                response_away.data.forEach(player => {
                    const playerInfo = document.createElement('p');
                    playerInfo.innerHTML = `
                        Type: ${player.type} <br>
                        Number: ${player.number} <br>
                        Player: ${player.player_name} <br>
                        Position: ${player.position}
                        ${player.team_captain === 1 ? '<br>Captain' : ''}
                    `;
                    awayFormation.appendChild(playerInfo);
                });
            } else {
                awayFormation.textContent = 'No formation found';
            }
        } else {
            awayFormation.textContent = 'No formation found';
        }
        awayColumn.appendChild(awayFormation);

    } catch (error) {
        console.error('Error fetching formation data:', error);
    }
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
}
