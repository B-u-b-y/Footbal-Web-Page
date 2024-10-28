const express = require('express');
const axios = require('axios');
const path = require('path');
// Create an Express router
const router = express.Router();


router.get('/api/players/players/:id', async (req, res) => {
    const { id } = req.params; // Extract the player ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8091/api/players/players/${id}`); // Ensure correct backend API port
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

router.get('/api/appearances/appearances/games/:player_id', async (req, res) => {
    const { player_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/appearances/appearances/games/${player_id}`); // Ensure correct backend API port
        if(response.data) {
            res.send(response.data);
        }
    }catch (error){
        res.send(error);
    }
});


router.get('/api/games/competition/:competition_id', async (req, res) => {
    const { competition_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/games/competition/${competition_id}`); // Ensure correct backend API port
        if(response.data) {
            res.send(response.data);
        }
    }catch (error){
        res.send(error);
    }
});

router.get('/api/club_games/club/games/:club_id', async (req, res) => {
    const { club_id } = req.params; // Extract the player ID from the request parameters
    try{
        const response = await axios.get(`http://localhost:8091/api/club_games/club/games/${club_id}`); // Ensure correct backend API port
        if(response.data) {
            res.send(response.data);
        }
    }catch (error){
        res.send(error);
    }
});

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

module.exports = router;
