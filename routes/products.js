const express = require("express");
const { Product, validateProduct } = require("../models/product");
const { ProductType } = require("../models/productType");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) return res.status(404).send("Products not found");

    res.status(200).send(products);
  } catch (e) {
    console.log(e.message);
    res.status(400).send("An error ocurred");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.id });
    if (!product) return res.status(404).send("Product not found");

    res.status(200).send(product);
  } catch (e) {
    console.log(e);
    res.status(404).send("Product not found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check product existence
    const productAlreadyExists = await Product.exists({
      name: req.body.name,
    });
    if (productAlreadyExists)
      return res.status(400).send("This product already exists");

    // Check product type existence
    const productTypeExists = await ProductType.exists({
      name: req.body.type,
    });
    if (!productTypeExists)
      return res.status(400).send("This product type is invalid");

    // Create a new product
    const product = new Product({
      name: req.body.name,
      type: req.body.type,
      creationDate: Date.now(),
    });

    // Insert into database
    await product.save();

    res.status(201).send(product);
  } catch (e) {
    res.status(500).send("Internal error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send("The provided id is invalid");
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send("Error");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Update existing product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          type: req.body.type,
          creationDate: Date.now(),
        },
      },
      { new: true }
    );

    res.status(200).send(product);
  } catch (e) {
    res.status(500).send("The provided id is invalid");
  }
});

module.exports = router;