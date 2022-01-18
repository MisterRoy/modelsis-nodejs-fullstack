const express = require("express");
const { validateProductType, ProductType } = require("../models/productType");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateProductType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check productType existence
    const alreadyExists = await ProductType.exists({
      name: req.body.name,
    });
    if (alreadyExists)
      return res.status(400).send("This product type already exists");

    // Create a new product type
    const productType = new ProductType({
      name: req.body.name,
      creationDate: Date.now(),
    });

    // Insert into database
    await productType.save();

    res.status(201).send(productType);
  } catch (e) {
    res.status(500).send("Internal error" + e.message);
  }
});

module.exports = router;
