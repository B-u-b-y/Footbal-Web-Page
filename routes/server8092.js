const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to request the plot from the Flask server
router.get('/api/plot', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8092/test', null, {
            responseType: 'arraybuffer', // Receive binary data (image) as the response
        });
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error retrieving plot image:', error);
        res.status(500).json({ error: 'Error retrieving plot image' });
    }
});

router.get('/api/world-map', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8092/world-map', null, {
            responseType: 'arraybuffer', // Receive binary data (image) as the response
        });

        // Assuming response contains both countries_with_games and image in JSON format
        const jsonResponse = JSON.parse(response.data.toString('utf-8'));

        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
        res.send(jsonResponse); // Send the parsed JSON response
    } catch (error) {
        console.error('Error retrieving world map image:', error);
        res.status(500).json({ error: 'Error retrieving world map image' });
    }
});

router.get('/api/player-stats', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8092/player-stats', null, {
            responseType: 'arraybuffer', // Receive binary data (image) as the response
        });
        res.setHeader('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Error retrieving world map image:', error);
        res.status(500).json({ error: 'Error retrieving world map image' });
    }
});
module.exports = router;
