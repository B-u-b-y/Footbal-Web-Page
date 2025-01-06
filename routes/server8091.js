const express = require('express');
const axios = require('axios');
const path = require('path');
const router = express.Router();

/**
* @swagger
* /server8091/api/appearances/appearances/games/{player_id}:
*   get:
*     summary: Get the game statistics for a specific player
*     description: This endpoint retrieves the game statistics for a player identified by the `player_id` parameter. The statistics include information like goals, assists, minutes played, yellow cards, red cards, and more, across various competitions and seasons.
*     parameters:
*       - in: path
*         name: player_id
*         required: true
*         description: The unique ID of the player whose game statistics are to be retrieved.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successfully retrieved game statistics
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   yellow_cards:
*                     type: integer
*                     description: The number of yellow cards the player received in the game.
*                   red_cards:
*                     type: integer
*                     description: The number of red cards the player received in the game.
*                   goals:
*                     type: integer
*                     description: The number of goals the player scored in the game.
*                   assists:
*                     type: integer
*                     description: The number of assists the player made in the game.
*                   minutes_played:
*                     type: integer
*                     description: The number of minutes the player played in the game.
*                   competition_id:
*                     type: string
*                     description: The competition where the game took place (e.g., domestic league, international cup).
*                   season:
*                     type: integer
*                     description: The season the game was part of.
*                   date:
*                     type: string
*                     format: date
*                     description: The date the game took place.
*                   home_club_name:
*                     type: string
*                     description: The name of the home club in the game.
*                   away_club_name:
*                     type: string
*                     description: The name of the away club in the game.
*                   aggregate:
*                     type: string
*                     description: The aggregate score of the match (if applicable).
*                   competition_type:
*                     type: string
*                     description: The type of competition (e.g., international, domestic).
*       500:
*         description: Internal server error. This error is returned if there is an issue with the backend API.
*/
router.get('/api/appearances/appearances/games/:player_id', async (req, res) => {
    const { player_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/appearances/appearances/games/${player_id}`);
        if(response.data) {
            res.send(response.data);
        }
    }catch (error){
        res.send(error);
    }
});

/**
* @swagger
* paths:
*   /server8091/api/games/competition/{competition_id}:
*     get:
*       summary: Retrieve games in a specific competition
*       description: Fetches the games for the provided competition ID.
*       operationId: getGamesByCompetitionId
*       parameters:
*         - in: path
*           name: competition_id
*           required: true
*           description: The competition ID.
*           schema:
*             type: string
*       responses:
*         '200':
*           description: A list of games in the specified competition.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                       description: The unique ID for the game entry.
*                     game_id:
*                       type: integer
*                       description: The unique ID for the game.
*                     competition_id:
*                       type: string
*                       description: The ID of the competition the game belongs to.
*                     season:
*                       type: integer
*                       description: The season of the game.
*                     round:
*                       type: string
*                       description: The round of the competition.
*                     date:
*                       type: string
*                       format: date-time
*                       description: The date the game took place.
*                     home_club_id:
*                       type: integer
*                       description: The ID of the home club.
*                     away_club_id:
*                       type: integer
*                       description: The ID of the away club.
*                     home_club_goals:
*                       type: integer
*                       description: The number of goals scored by the home club.
*                     away_club_goals:
*                       type: integer
*                       description: The number of goals scored by the away club.
*                     home_club_manager_name:
*                       type: string
*                       description: The name of the home club manager.
*                     away_club_manager_name:
*                       type: string
*                       description: The name of the away club manager.
*                     stadium:
*                       type: string
*                       description: The name of the stadium where the game took place.
*                     attendance:
*                       type: integer
*                       description: The attendance of the game.
*                     referee:
*                       type: string
*                       description: The referee for the game.
*                     home_club_formation:
*                       type: string
*                       description: The formation of the home club.
*                     away_club_formation:
*                       type: string
*                       description: The formation of the away club.
*                     home_club_name:
*                       type: string
*                       description: The name of the home club.
*                     away_club_name:
*                       type: string
*                       description: The name of the away club.
*                     aggregate:
*                       type: string
*                       description: The aggregate score between the two teams.
*                     competition_type:
*                       type: string
*                       description: The type of competition.
*                     country:
*                       type: string
*                       description: The country where the competition takes place.
*         '500':
*           description: Internal server error.
 * */
router.get('/api/games/competition/:competition_id', async (req, res) => {
    const { competition_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/games/competition/${competition_id}`);
        if(response.data) {
            res.send(response.data);
        }
    }catch (error){
        res.send(error);
    }
});

/**
* @swagger
* paths:
*   /server8091/api/club_games/club/games/{club_id}:
*     get:
*       summary: Retrieve games for a specific club
*       description: Fetches the games for the specified club ID, including details like opponent, scores, manager names, etc.
*       operationId: getGamesByClubId
*       parameters:
*         - in: path
*           name: club_id
*           required: true
*           description: The unique identifier of the club.
*           schema:
*             type: integer
*       responses:
*         '200':
*           description: A list of games for the specified club.
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                       description: The unique identifier for the game entry.
*                     game_id:
*                       type: integer
*                       description: The unique game ID.
*                     club_id:
*                       type: integer
*                       description: The ID of the club that played the game.
*                     own_goals:
*                       type: integer
*                       description: The number of goals scored by the club.
*                     own_manager_name:
*                       type: string
*                       description: The name of the club's manager.
*                     opponent_id:
*                       type: integer
*                       description: The ID of the opposing team.
*                     opponent_goals:
*                       type: integer
*                       description: The number of goals scored by the opponent.
*                     opponent_manager_name:
*                       type: string
*                       description: The name of the opponent's manager.
*                     hosting:
*                       type: string
*                       description: Whether the club was hosting the game.
*                     is_win:
*                       type: integer
*                       description: Whether the club won the game.
*         '500':
*           description: Internal server error.
*/
router.get('/api/club_games/club/games/:club_id', async (req, res) => {
    const { club_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/club_games/club/games/${club_id}`);
        if(response.data) {
            res.send(response.data);
        }
        console.log('/api/club_games/club/games/:club_id', response, response.data);
    }catch (error){
        res.send(error);
    }
});

/**
* @swagger
* /server8091/api/game_events/game/{game_id}:
*   get:
*     summary: Retrieve game events for a specific game by game_id
*     description: Fetches all game events for the given game_id and enriches them with player and club information.
*     parameters:
*       - in: path
*         name: game_id
*         required: true
*         description: The ID of the game to retrieve events for.
*         schema:
*           type: string
*     responses:
*       200:
*         description: A list of enriched game events, sorted by minute.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   minute:
*                     type: integer
*                     description: The minute the event occurred.
*                   type:
*                     type: string
*                     description: The type of event.
*                   club_name:
*                     type: string
*                     description: The name of the club involved in the event.
*                   player_name:
*                     type: string
*                     description: The name of the player who participated in the event.
*                   description:
*                     type: string
*                     description: A brief description of the event.
*                   player_in_id:
*                     type: string
*                     description: The name of the player who replaced another player.
*                   player_assist_id:
*                     type: string
*                     description: The name of the player who assisted in the event.
*       500:
*         description: An error occurred while fetching the game events.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "An error occurred while fetching game events."
*/
router.get('/api/game_events/game/:game_id', async (req, res) => {
    const { game_id } = req.params;
    try {
        // First, get all game events for the game_id
        const response = await axios.get(`http://localhost:8091/api/game_events/game/${game_id}`);
        const gameEvents = response.data;

        // Process each game event
        const enrichedEvents = await Promise.all(gameEvents.map(async (event) => {
            try {
                // Get player information
                const playerResponse = await axios.get(`http://localhost:8090/players/${event.player_id}`);
                event.player_id = playerResponse.data.name;

                if (event.player_in_id !== -1) {
                    const response_in = await axios.get(`http://localhost:8090/players/${event.player_in_id}`);
                    event.player_in_id = response_in.data.name;
                }
                if (event.player_assist_id !== -1) {
                    const response_assist = await axios.get(`http://localhost:8090/players/${event.player_assist_id}`);
                    event.player_assist_id = response_assist.data.name;
                }

                // Get club information
                const clubResponse = await axios.get(`http://localhost:8090/clubs/${event.club_id}`);
                const clubName = clubResponse.data.name || 'Unknown'; // Default to "Unknown" if club name is missing

                // Return an object with the desired fields
                return {
                    minute: event.minute,
                    type: event.type,
                    club_name: clubName,
                    player_name: event.player_id,
                    description: event.description,
                    player_in_id: event.player_in_id,
                    player_assist_id: event.player_assist_id
                };
            } catch (error) {
                console.error("Error fetching player or club data:", error);
                return null; // Skip if there's an error for an individual event
            }
        }));

        // Filter out any null entries due to errors
        const validEvents = enrichedEvents.filter(event => event !== null);

        // Sort the events by minute in ascending order
        validEvents.sort((a, b) => a.minute - b.minute);

        // Send the sorted events
        res.json(validEvents);
    } catch (error) {
        console.error("Error fetching game events:", error);
        res.status(500).send("An error occurred while fetching game events.");
    }
});


/**
* @swagger
* /server8091/api/game_lineups/game/{game_id}/{Team}:
*   get:
*     summary: Get the player lineup for a specific game and team
*     description: This endpoint retrieves the lineup details for a specific game and team based on the provided `game_id` and `Team` parameters.
*     parameters:
*       - name: game_id
*         in: path
*         description: The unique identifier of the game.
*         required: true
*         schema:
*           type: string
*       - name: Team
*         in: path
*         description: The team for which the lineup is requested.
*         required: true
*         schema:
*           type: string
*           enum: [home, away]
*     responses:
*       200:
*         description: Successful response containing the lineup data.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 game_id:
*                   type: integer
*                   description: The game ID.
*                 team:
*                   type: string
*                   description: The team for which the lineup is returned.
*                 lineup:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       player_id:
*                         type: integer
*                         description: The player ID.
*                       player_name:
*                         type: string
*                         description: The name of the player.
*                       position:
*                         type: string
*                         description: The position of the player.
*                       status:
*                         type: string
*                         description: The status of the player (e.g., active, substituted).ù
*       500:
*         description: Internal server error when something goes wrong during the request.
*/
router.get('/api/game_lineups/game/:game_id/:Team', async (req, res) => {
    const { game_id, Team } = req.params;
    try {
        const response = await axios.get(`http://localhost:8091/api/game_lineups/game/${game_id}/${Team}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

/**
* @swagger
* /server8091/api/games/standings/{competition_id}:
*   get:
*     summary: Retrieve the standings for a given competition
*     description: Fetches the standings of the specified competition, identified by the competition ID.
*     parameters:
*       - name: competition_id
*         in: path
*         required: true
*         description: The unique identifier for the competition whose standings are being fetched.
*         schema:
*           type: string
*     responses:
*       200:
*         description: A list of standings for the competition, categorized by matchday.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   round:
*                     type: string
*                     description: The matchday or round number.
*                   teams:
*                     type: array
*                     description: A list of teams with their standings in the current round.
*                     items:
*                       type: object
*                       properties:
*                         position:
*                           type: integer
*                           description: The team's current position in the standings.
*                         teamName:
*                           type: string
*                           description: The name of the team.
*       500:
*         description: An error occurred while fetching the standings.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: A message explaining the error.
*/
router.get('/api/games/standings/:competition_id', async (req, res) => {
    const { competition_id } = req.params;

    try {
        const response = await axios.get(`http://localhost:8091/api/games/standings/${competition_id}`);
        if (response.data) {
            res.send(response.data);
        }
    } catch (error) {
        console.error('Error during search request:', error);
        res.send(error);
    }
});

module.exports = router;
