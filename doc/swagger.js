const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'ModelSis Fullstack challenge - API',
      description:
        'This is a challenge intiated by ModelSis. It consists in building a basic fullstack web app. The current repository refers to the backend side.',
      contact: {
        name: 'Mister Roy',
      },
      servers: ['http://localhost:4000/api'],
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerOptions;
