// Event listener for DOMContentLoaded to initiate functions once the document is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    const spinnerOverlay = createSpinnerOverlay();
    document.body.appendChild(spinnerOverlay); // Add overlay to body for full-page centering

    // Load the content with spinner active
    await plotGraph();
    await fetchWorldMap();
    await displayPlayerStats();

    // Remove spinner overlay after content loads
    spinnerOverlay.remove();
});

async function plotGraph() {
    const loadingMessage = document.createElement('p');
    loadingMessage.innerText = 'Loading plot...';

    try {
        const response = await fetch('/server8092/api/plot');
        if (!response.ok) {
            throw new Error('Failed to fetch the plot image');
        }
        const blob = await response.blob(); // Get the image as a blob
        const imageUrl = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = imageUrl; // Set the blob URL as the src of the img element
        img.alt = "Plot Image";

        img.onload = () => {
            // Create a new container only when the image has loaded
            const chartContainer = createChartContainer("Trends in the Number of Games Played by Country",
                "A comprehensive analysis reveals significant trends in the number of games played across domestic leagues in various countries over multiple seasons.<br>" +
                "This visualization captures year-on-year changes, offering insights into the dynamics of league play worldwide.<br><br>" +
                "<strong>Trend Analysis:</strong><br>" +
                "&nbsp;&nbsp;- The graph highlights fluctuations in the number of games played over the years, showcasing the evolving landscape of domestic leagues.<br>" +
                "&nbsp;&nbsp;- Comparative insights allow for an assessment of game counts across different countries, revealing how they respond to changing conditions in sports governance and public interest.<br><br>" +
                "The data presented exclusively pertains to domestic league competitions. Notably, the latest season recorded a universal decline in the number of games played across all countries represented in the dataset.<br>" +
                "This decline may prompt further investigation into the factors influencing league participation in recent times."
            );

            chartContainer.appendChild(img); // Add new image to the container
            loadingMessage.remove(); // Remove loading message
        };
        // Append the loading message to the plots-container while waiting for the image
        document.getElementById('plots-container').appendChild(loadingMessage);
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.innerText = error.message; // Display error message
        document.getElementById('plots-container').appendChild(errorMessage);
    }
}

async function fetchWorldMap() {
    const loadingMessage = document.createElement('p');
    loadingMessage.innerText = 'Loading world map...';

    try {
        const response = await fetch('/server8092/api/world-map');
        if (!response.ok) {
            throw new Error('Failed to fetch the world map data');
        }
        const data = await response.json(); // Parse JSON response

        const countries_with_games = data['countries_with_games'];
        const img = document.createElement('img');
        img.src = 'data:image/png;base64,' + data['image']; // Use Base64 string as the src
        img.alt = "World Map";

        img.onload = () => {
            // Create a new container only when the image has loaded
            const chartContainer = createChartContainer(
                "Games per Country",
                "This map visualizes the number of games played in each country.<br>" +
                "&nbsp;&nbsp;- Darker shades indicate a higher total, while light grey denotes countries with no recorded guest goals.<br>" +
                "This visualization reveals the global spread of guest goals, highlighting countries with more active gameplay.<br>" +
                "&nbsp;&nbsp;- Italy stands out as having the highest guest goal activity, and Europe emerges as the most active continent in this respect.<br>" +
                "The only higlighted countries are: " + countries_with_games.join(', ') + "that means that the rest of the countries have no recorded games."
                );
            chartContainer.appendChild(img); // Add the new image to the container
            loadingMessage.remove(); // Remove loading message
        };
        // Append the loading message to the plots-container while waiting for the image
        document.getElementById('plots-container').appendChild(loadingMessage);
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.innerText = error.message; // Display error message
        document.getElementById('plots-container').appendChild(errorMessage);
    }
}

async function displayPlayerStats() {
    const loadingMessage = document.createElement('p');
    loadingMessage.innerText = 'Loading player stats...';

    try {
        const response = await fetch('/server8092/api/player-stats');
        if (!response.ok) {
            throw new Error('Failed to fetch the player stats image');
        }
        const blob = await response.blob(); // Get the image as a blob
        const imageUrl = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = imageUrl; // Set the blob URL as the src of the img element
        img.alt = "Player Stats";

        img.onload = () => {
            // Create a new container only when the image has loaded
            const chartContainer = createChartContainer("Performance Metrics of the Top 15 Players: Goals, Assists, Playtime, and Discipline",
                "This bar chart showcases the performance metrics for the top 15 players ranked by total goals scored, with details on:<br>" +
                "&nbsp;&nbsp;- <strong>Total Goals:</strong> Number of goals each player has scored.<br>" +
                "&nbsp;&nbsp;- <strong>Total Assists:</strong> Count of assists made by each player, highlighting their role in creating goal opportunities.<br>" +
                "&nbsp;&nbsp;- <strong>Total Playtime:</strong> Total playtime in hours for each player, converted from minutes to show their contribution across matches.<br>" +
                "&nbsp;&nbsp;- <strong>Yellow Cards:</strong> Number of yellow cards received, reflecting disciplinary warnings.<br>" +
                "&nbsp;&nbsp;- <strong>Red Cards:</strong> Number of red cards, indicating more serious infractions during gameplay."
            );

            chartContainer.appendChild(img); // Add new image to the container
            loadingMessage.remove(); // Remove loading message
        };
        // Append the loading message to the plots-container while waiting for the image
        document.getElementById('plots-container').appendChild(loadingMessage);
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.innerText = error.message; // Display error message
        document.getElementById('plots-container').appendChild(errorMessage);
    }
}

// Function to create a new chart container with formatted HTML descriptions
function createChartContainer(title, description) {
    const container = document.createElement('div');
    container.classList.add('chart-container');

    const titleElement = document.createElement('h2');
    titleElement.innerText = title;
    container.appendChild(titleElement); // Add title

    // Use innerHTML to allow line breaks and indents in the description
    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = description; // Set as HTML content
    container.appendChild(descriptionElement); // Add description

    // Append the entire chart container to the plots-container
    document.getElementById('plots-container').appendChild(container);

    return container; // Return the container for further use
}


function createSpinnerOverlay() {
    // Create overlay div
    const overlay = document.createElement('div');
    overlay.classList.add('spinner-overlay'); // Full-page overlay for centering

    // Create spinner div
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    // Append spinner to overlay
    overlay.appendChild(spinner);

    // Return the overlay so it can be appended to the DOM
    return overlay;
}