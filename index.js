const express = require("express");
const mongoose = require("mongoose");
const products = require("./routes/products");
const productTypes = require("./routes/productTypes");

const app = express();

mongoose
  .connect("mongodb://localhost/modelsis-db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log("Connection to MongoDB failed..."));

app.use(express.json());
app.use("/api/products", products);
app.use("/api/productType", productTypes);

app.listen(3000, () => console.log("Listening on port 3000 ..."));
