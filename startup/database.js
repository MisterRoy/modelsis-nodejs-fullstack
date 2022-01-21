const mongoose = require('mongoose');
const logger = require('../logger/logger');

function connectToDatabase(connectString) {
  try {
    mongoose.connect(connectString);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(
      `Connection to MongoDB failed: ${error.message}. Terminating procress.`
    );
    process.exit(1);
  }
}

exports.connectToDatabase = connectToDatabase;
