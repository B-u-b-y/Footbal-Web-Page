const express = require('express');
const axios = require('axios');
const path = require('path');
// Create an Express router
const router = express.Router();


router.get('/api/players/players/:id', async (req, res) => {
    const { id } = req.params; // Extract the player ID from the request parameters
    try {
        const response = await axios.get(`http://localhost:8091/api/players/players/${id}`); // Ensure correct backend API port
        console.log('Response:', response.data);
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


module.exports = router;
