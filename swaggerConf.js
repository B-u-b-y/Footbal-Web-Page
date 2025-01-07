const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MainServer API',
            version: '1.0.0',
            contact: {
                name: 'Budaes Tanaru Riccardo Gabriele',
                email: 'riccardo.budaestanar@edu.unito.it',
                url: 'riccardo.budaestanar@edu.unito.it'
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
