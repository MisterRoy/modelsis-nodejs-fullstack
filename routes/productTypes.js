const express = require('express');
const { validateProductType, ProductType } = require('../models/productType');
const router = express.Router();
const logger = require('../logger/logger');

/**
 * @swagger
 * /api/productType:
 *  get:
 *    description: Get all product types
 *    responses:
 *      '200':
 *        description: Successful response
 *      '400':
 *        description: Bad request
 *      '404':
 *        description: Products not found
 */
router.get('/', async (req, res) => {
  try {
    const productTypes = await ProductType.find();
    if (!productTypes) return res.status(404).send('Products not found');

    res.status(200).send(productTypes);
  } catch (e) {
    logger.error(e.message);
    res.status(400).send('An error ocurred');
  }
});

/**
 * @swagger
 * /api/productType:
 *  post:
 *    description: Create a product type
 *    responses:
 *      '201':
 *        description: Successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal error
 */
router.post('/', async (req, res) => {
  const { error } = validateProductType(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check productType existence
    const alreadyExists = await ProductType.exists({
      name: req.body.name,
    });
    if (alreadyExists)
      return res.status(400).send('This product type already exists');

    // Create a new product type
    const productType = new ProductType({
      name: req.body.name,
      creationDate: Date.now(),
    });

    // Insert into database
    await productType.save();

    logger.info(`Product type ${productType.name} created`);
    res.status(201).send(productType);
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Internal error' + e.message);
  }
});

module.exports = router;
