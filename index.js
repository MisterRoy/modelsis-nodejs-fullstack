const express = require('express');
const products = require('./routes/products');
const productTypes = require('./routes/productTypes');
const logger = require('./logger/logger');
const cors = require('cors');
const config = require('config');
const { connectToDatabase } = require('./startup/database');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./doc/swagger');

const app = express();

let connectString = 'mongodb://localhost/modelsis-db';
let runningPort = 4000;

try {
  runningPort = config.get('MODELSIS_PORT');
  const username = config.get('MODELSIS_BD_USERNAME');
  const password = config.get('MODELSIS_BD_PASSWORD');
  const host = config.get('MODELSIS_BD_HOST');
  const port = config.get('MODELSIS_BD_PORT');
  connectString = `mongodb://${username}:${password}@${host}:${port}/$modelsis-db`;
} catch (error) {
  logger.warn('Some environment variables may not have been set correctly.');
  logger.warn('Using default configuration');
}

connectToDatabase(connectString);

app.use(cors());
app.use(express.json());
app.use('/api/products', products);
app.use('/api/productType', productTypes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(runningPort, () =>
  logger.info(`Listening on port ${runningPort} ...`)
);
