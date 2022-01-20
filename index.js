const express = require("express");
const mongoose = require("mongoose");
const products = require("./routes/products");
const productTypes = require("./routes/productTypes");
const logger = require("./logger/logger");
const cors = require('cors')

const app = express();

mongoose
  .connect("mongodb://localhost/modelsis-db")
  .then(() => logger.info("Connected to MongoDB"))
  .catch(() => logger.info("Connection to MongoDB failed..."));

app.use(cors())
app.use(express.json());
app.use("/api/products", products);
app.use("/api/productType", productTypes);

app.listen(4000, () => logger.info("Listening on port 4000 ..."));
