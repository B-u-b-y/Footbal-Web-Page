const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * /server8092/api/plot:
 *   get:
 *     summary: Retrieve a plot image from the Flask server
 *     tags:
 *       - Server 8092
 *     description: This route makes a request to the Flask server to fetch a plot image and returns it as a PNG image.
 *     responses:
 *       200:
 *         description: Successfully retrieved the plot image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: byte
 *       500:
 *         description: Error retrieving plot image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving plot image"
 *     operationId: getPlotImage
 */
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

/**
 * @swagger
 * /server8092/api/world-map:
 *   get:
 *     summary: Get world map data
 *     tags:
 *       - Server 8092
 *     description: Returns a list of countries and an image encoded in base64.
 *     responses:
 *       200:
 *         description: A list of countries and image data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countries:
 *                   type: array
 *                   items:
 *                     type: string
 *                 image:
 *                   type: string
 */
router.get('/api/world-map', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8092/world-map', null, {
            responseType: 'arraybuffer', // Receive binary data (image) as the response
        });

        const jsonResponse = JSON.parse(response.data.toString('utf-8'));

        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
        res.send(jsonResponse); // Send the parsed JSON response
    } catch (error) {
        console.error('Error retrieving world map image:', error);
        res.status(500).json({ error: 'Error retrieving world map image' });
    }
});

/**
 * @swagger
 * /server8092/api/player-stats:
 *   get:
 *     summary: Retrieve player statistics image
 *     tags:
 *       - Server 8092
 *     description: This endpoint retrieves a player statistics image from another service and serves it as a PNG image.
 *     responses:
 *       200:
 *         description: Player statistics image successfully retrieved
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error occurred while retrieving the player statistics image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving world map image"
 */
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
