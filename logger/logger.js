const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
  format: combine(
    // format.colorize(),
    label({ label: "API" }),
    timestamp({ format: "HH:mm:ss DD/MM/YYYY" }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs.txt" }),
  ],
});

module.exports = logger;
