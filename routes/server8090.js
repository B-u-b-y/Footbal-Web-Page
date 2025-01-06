const express = require('express');
const axios = require('axios');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * paths:
 *   /server8090/{country_name}/competitions:
 *     get:
 *       summary: Fetch competitions for a specific country
 *       tags:
 *         - Server 8090
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
 */
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
 *       tags:
 *         - Server 8090
 *       description: Retrieves a list of countries participating in competitions.
 *       responses:
 *         200:
 *           description: List of countries
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: string
 *         500:
 *           description: Server error occurred during the request.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "An error occurred during the search request."
 */
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
 * paths:
 *   /server8090/{competition}/clubs:
 *     get:
 *       summary: Get a list of clubs for a specific competition
 *       tags:
 *         - Server 8090
 *       description: Fetches the list of clubs for the specified competition code.
 *       parameters:
 *         - in: path
 *           name: competition
 *           required: true
 *           description: The code of the competition (e.g., "IT1" for Serie A in Italy).
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully fetched the list of clubs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     club_id:
 *                       type: integer
 *                       description: Unique identifier for the club
 *                     club_code:
 *                       type: string
 *                       description: Code for the club
 *                     name:
 *                       type: string
 *                       description: Name of the club
 *                     domestic_competition_id:
 *                       type: string
 *                       description: ID of the domestic competition
 *                     squad_size:
 *                       type: integer
 *                       description: Number of players in the club's squad
 *                     average_age:
 *                       type: number
 *                       format: float
 *                       description: Average age of players in the club
 *                     foreigners_number:
 *                       type: integer
 *                       description: Number of foreign players in the club
 *                     national_team_players:
 *                       type: integer
 *                       description: Number of players from the national team
 *                     stadium_name:
 *                       type: string
 *                       description: Name of the club's stadium
 *                     stadium_seats:
 *                       type: integer
 *                       description: Number of seats in the club's stadium
 *                     net_transfer_record:
 *                       type: string
 *                       description: The club's net transfer record
 *                     last_season:
 *                       type: integer
 *                       description: The last season the club participated in the competition
 *                     foreign_percentage:
 *                       type: number
 *                       format: float
 *                       description: Percentage of foreign players in the club
 *         500:
 *           description: Internal server error occurred during the request
 */
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
 *     tags:
 *     - Server 8090
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
 *                 club_code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 domestic_competition_id:
 *                   type: string
 *                 squad_size:
 *                   type: integer
 *                 average_age:
 *                   type: number
 *                 foreigners_number:
 *                   type: integer
 *                 national_team_players:
 *                   type: integer
 *                 stadium_name:
 *                   type: string
 *                 stadium_seats:
 *                   type: integer
 *                 net_transfer_record:
 *                   type: string
 *                 last_season:
 *                   type: integer
 *                 foreign_percentage:
 *                   type: number
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
 *     tags:
 *     - Server 8090
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
 *                   name:
 *                     type: string
 *                   last_season:
 *                     type: integer
 *                   current_club_id:
 *                     type: integer
 *                   player_code:
 *                     type: string
 *                   country_of_birth:
 *                     type: string
 *                   city_of_birth:
 *                     type: string
 *                   country_of_citizenship:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                   sub_position:
 *                     type: string
 *                   position:
 *                     type: string
 *                   foot:
 *                     type: string
 *                   height_in_cm:
 *                     type: integer
 *                   market_value_in_eur:
 *                     type: string
 *                   highest_market_value_in_eur:
 *                     type: string
 *                   contract_expiration_date:
 *                     type: string
 *                   agent_name:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   url:
 *                     type: string
 *                   current_club_domestic_competition_id:
 *                     type: string
 *                   current_club_name:
 *                     type: string
 *                   age:
 *                     type: integer
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
 *     tags:
 *     - Server 8090
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
