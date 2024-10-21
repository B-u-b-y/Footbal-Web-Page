const express = require('express');
const axios = require('axios');
const path = require('path');
// Create an Express router
const router = express.Router();

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

router.get('/competitions/country', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8090/competitions/country`);
        res.send(response.data);
    } catch (error) {
        console.error('Error during search request:', error);
        res.status(500).json({ error: 'An error occurred during the search request.' });
    }
});

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

// New route for fetching players by club
router.get('/:club/players', async (req, res) => {
    const { club } = req.params; // Extract the club ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8090/${club}/players`); // Adjust API URL if needed
        res.send(response.data);
    } catch (error) {
        console.error('Error during fetching players:', error);
        res.status(500).json({ error: 'An error occurred during the fetching players request.' });
    }
});

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
