const express = require('express');
const axios = require('axios');
const path = require('path');
const router = express.Router();

/**
* @swagger
* paths:
*   /server8090/{country_name}/competitions:
*     get:
*       tags:
*         - Server 8090
*       summary: Fetch competitions for a specific country
*       description: Returns a list of competitions for the specified country.
*       parameters:
*         - name: country_name
*           in: path
*           required: true
*           description: The name of the country to fetch competitions for (e.g., "Italy").
*           schema:
*             type: string
*       responses:
*         200:
*           description: List of competitions in the selected country.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     competition_id:
*                       type: string
*                       description: The unique identifier for the competition.
*                     competition_code:
*                       type: string
*                       description: The code of the competition.
*                     name:
*                       type: string
*                       description: The name of the competition.
*                     sub_type:
*                       type: string
*                       description: The subtype of the competition.
*                     type:
*                       type: string
*                       description: The type of competition.
*                     country_id:
*                       type: integer
*                       description: The unique identifier of the country.
*                     country_name:
*                       type: string
*                       description: The name of the country.
*                     domestic_league_code:
*                       type: string
*                       description: The code for the domestic league.
*         500:
*           description: Internal server error.
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: "An error occurred during the search request."
* */
// Define the route to fetch competitions for a specific country
router.get('/:country_name/competitions', async (req, res) => {
    const { country_name } = req.params; // Extract the country name from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/${country_name}/competitions`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

/**
* @swagger
* paths:
*   /server8090/competitions/country:
*     get:
*       summary: Get the list of competition countries
*       description: Retrieves a list of countries participating in competitions.
*       tags:
*         - Competitions
*       responses:
*         '200':
*           description: A list of countries participating in competitions.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: string
*         '500':
*           description: Server error occurred during the request.
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: "An error occurred during the search request."
* */
router.get('/competitions/country', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8090/competitions/country`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

/**
* @swagger
* tags:
*   - name: Competition
*     description: Operations related to competitions and their clubs
*
*   /server8090/{competition}/clubs:
*   get:
*     summary: Get a list of clubs for a specific competition
*     description: Fetches the list of clubs for the specified competition code.
*     parameters:
*       - in: path
*         name: competition
*         required: true
*         description: The code of the competition (e.g., "IT1" for Serie A in Italy).
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successfully fetched the list of clubs
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   club_id:
*                     type: integer
*                     description: Unique identifier for the club
*                   club_code:
*                     type: string
*                     description: Code for the club (e.g., "as-rom" for Roma)
*                   name:
*                     type: string
*                     description: Name of the club
*                   domestic_competition_id:
*                     type: string
*                     description: ID of the domestic competition
*                   squad_size:
*                     type: integer
*                     description: Number of players in the club's squad
*                   average_age:
*                     type: number
*                     format: float
*                     description: Average age of players in the club
*                   foreigners_number:
*                     type: integer
*                     description: Number of foreign players in the club
*                   national_team_players:
*                     type: integer
*                     description: Number of players from the national team
*                   stadium_name:
*                     type: string
*                     description: Name of the club's stadium
*                   stadium_seats:
*                     type: integer
*                     description: Number of seats in the club's stadium
*                   net_transfer_record:
*                     type: string
*                     description: The club's net transfer record
*                   last_season:
*                     type: integer
*                     description: The last season the club participated in the competition
*                   foreign_percentage:
*                     type: number
*                     format: float
*                     description: Percentage of foreign players in the club
*       400:
*         description: Invalid competition code provided
*       500:
*         description: Internal server error occurred during the request
* */
router.get('/:competition/clubs', async (req, res) => {
    const { competition } = req.params; // Extract the competition code from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/${competition}/clubs`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

/**
* @swagger
* /server8090/clubs/{club_id}:
*   get:
*     summary: Retrieve details of a specific football club
*     description: Fetches the information of a football club by its ID.
*     parameters:
*       - in: path
*         name: club_id
*         required: true
*         description: The unique ID of the club to fetch details for.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Club details successfully retrieved.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 club_id:
*                   type: integer
*                   description: Unique identifier for the club.
*                 club_code:
*                   type: string
*                   description: The code or short name of the club, typically used in league tables or systems.
*                 name:
*                   type: string
*                   description: Full name of the club.
*                 domestic_competition_id:
*                   type: string
*                   description: The ID of the domestic competition the club participates in (e.g., 'IT1' for Serie A).
*                 squad_size:
*                   type: integer
*                   description: The total number of players in the club's squad.
*                 average_age:
*                   type: number
*                   description: The average age of the players in the club's squad.
*                 foreigners_number:
*                   type: integer
*                   description: The number of foreign players in the club's squad.
*                 national_team_players:
*                   type: integer
*                   description: The number of players in the club who are part of a national football team.
*                 stadium_name:
*                   type: string
*                   description: The name of the club's home stadium.
*                 stadium_seats:
*                   type: integer
*                   description: The seating capacity of the stadium.
*                 net_transfer_record:
*                   type: string
*                   description: The club's net transfer balance, indicating how much they have spent or earned in player transfers (e.g., '+€5.56m').
*                 last_season:
*                   type: integer
*                   description: The year of the club's most recent season.
*                 foreign_percentage:
*                   type: number
*                   description: The percentage of foreign players in the club's squad.
*       500:
*         description: Internal server error during fetching the club details.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'An error occurred during the fetching club details request.'
*/
router.get('/clubs/:club_id', async (req, res) => {
    const { club_id } = req.params; // Extract the club ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/clubs/${club_id}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during fetching club details:', error);
        res.status(500).json({ error: 'An error occurred during the fetching club details request.' });
    }
});

/**
* @swagger
* /server8090/{club}/players:
*   get:
*     summary: Retrieve the list of players for a specific football club
*     description: Fetches the list of players associated with a club by its unique club ID.
*     parameters:
*       - in: path
*         name: club
*         required: true
*         description: The unique ID of the club for which players need to be fetched.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Players successfully retrieved for the specified club.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   player_id:
*                     type: integer
*                     description: Unique identifier for the player.
*                   name:
*                     type: string
*                     description: Full name of the player.
*                   last_season:
*                     type: integer
*                     description: The year of the player's last season.
*                   current_club_id:
*                     type: integer
*                     description: The ID of the player's current club.
*                   player_code:
*                     type: string
*                     description: The code or nickname used for the player in league tables.
*                   country_of_birth:
*                     type: string
*                     description: The country where the player was born.
*                   city_of_birth:
*                     type: string
*                     description: The city where the player was born.
*                   country_of_citizenship:
*                     type: string
*                     description: The country the player holds citizenship in.
*                   date_of_birth:
*                     type: string
*                     format: date
*                     description: The date of birth of the player.
*                   sub_position:
*                     type: string
*                     description: The specific sub-position the player plays in (e.g., centre-forward).
*                   position:
*                     type: string
*                     description: The main position of the player (e.g., Attack).
*                   foot:
*                     type: string
*                     description: The dominant foot of the player (e.g., left or right).
*                   height_in_cm:
*                     type: integer
*                     description: The height of the player in centimeters.
*                   market_value_in_eur:
*                     type: string
*                     description: The current market value of the player in Euros (e.g., '1.50M').
*                   highest_market_value_in_eur:
*                     type: string
*                     description: The highest market value the player has ever had in Euros.
*                   contract_expiration_date:
*                     type: string
*                     format: date
*                     description: The expiration date of the player's contract (if applicable).
*                   agent_name:
*                     type: string
*                     description: The name of the player's agent.
*                   image_url:
*                     type: string
*                     description: URL to the player's image or portrait.
*                   url:
*                     type: string
*                     description: The URL to the player's profile on the external platform (e.g., Transfermarkt).
*                   current_club_domestic_competition_id:
*                     type: string
*                     description: The ID of the domestic competition the player's current club is in (e.g., 'IT1' for Serie A).
*                   current_club_name:
*                     type: string
*                     description: The name of the player's current club.
*                   age:
*                     type: integer
*                     description: The player's age.
*       500:
*         description: Internal server error during fetching players.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: 'An error occurred during the fetching players request.'
*/
router.get('/:club/players', async (req, res) => {
    const { club } = req.params; // Extract the club ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/${club}/players`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during fetching players:', error);
        res.status(500).json({ error: 'An error occurred during the fetching players request.' });
    }
});

/**
 * @swagger
 * /server8090/players/{player_id}:
 *   get:
 *     summary: Get player details by player ID
 *     description: Fetches detailed information about a player by their ID.
 *     parameters:
 *       - in: path
 *         name: player_id
 *         required: true
 *         description: The ID of the player.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A player object containing detailed information about the player.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 player_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 current_club_name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 market_value_in_eur:
 *                   type: string
 *       500:
 *         description: Error fetching player details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during the fetching player details request."
 */
router.get('/players/:player_id', async (req, res) => {
    const { player_id } = req.params; // Extract the player ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/players/${player_id}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during fetching player details:', error);
        res.status(500).json({ error: 'An error occurred during the fetching player details request.' });
    }
});

module.exports = router;
