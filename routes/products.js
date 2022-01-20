const express = require('express');
const { Product, validateProduct } = require('../models/product');
const { ProductType } = require('../models/productType');
const router = express.Router();
const logger = require('../logger/logger');

/**
 * @swagger
 * /api/products:
 *  get:
 *    description: Get all products
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
    const products = await Product.find();
    if (!products) return res.status(404).send('Products not found');

    res.status(200).send(products);
  } catch (e) {
    logger.error(e.message);
    res.status(400).send('An error ocurred');
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    description: Get a specific product
 *    responses:
 *      '200':
 *        description: Successful response
 *      '400':
 *        description: Bad request
 *      '404':
 *        description: Product not found
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).send(product);
  } catch (e) {
    logger.error(e.message);
    res.status(404).send('Product not found');
  }
});

/**
 * @swagger
 * /api/products:
 *  post:
 *    description: Create a product
 *    responses:
 *      '201':
 *        description: Successful response
 *      '400':
 *        description: Bad request
 *      '500':
 *        description: Internal error
 */
router.post('/', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Check product existence
    const productAlreadyExists = await Product.exists({
      name: req.body.name,
    });
    if (productAlreadyExists)
      return res.status(400).send('This product already exists');

    // Check product type existence
    const productTypeExists = await ProductType.exists({
      name: req.body.type,
    });
    if (!productTypeExists)
      return res.status(400).send('This product type is invalid');

    // Create a new product
    const product = new Product({
      name: req.body.name,
      type: req.body.type,
      creationDate: Date.now(),
    });

    // Insert into database
    await product.save();

    logger.info(`Product ${product._id} created`);
    res.status(201).send(product);
  } catch (e) {
    res.status(500).send('Internal error');
  }
});

/**
 * @swagger
 * /api/products:
 *  delete:
 *    description: Create a product
 *    responses:
 *      '200':
 *        description: Successful response
 *      '404':
 *        description: Invalid id
 *      '500':
 *        description: Internal error
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send('The provided id is invalid');
    logger.info(`Product ${product._id} deleted`);
    res.status(200).send(product);
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Error');
  }
});

/**
 * @swagger
 * /api/products:
 *  put:
 *    description: Create a product
 *    responses:
 *      '200':
 *        description: Successful response
 *      '400':
 *        description: The product already exists
 *      '500':
 *        description: Internal error
 */
router.put('/:id', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Validating id
    const idExists = await Product.exists({ _id: req.params.id });
    if (!idExists) return res.status(400).send('Invalid id');

    // Checking if another product has the same properties
    const productAlreadyExists = await Product.exists({
      _id: { $ne: req.params.id },
      name: req.body.name,
      type: req.body.type,
    });
    if (productAlreadyExists)
      return res.status(400).send('This product already exists');

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

    logger.info(`Product ${product._id} updated`);
    res.status(200).send(product);
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Internal error');
  }
});

module.exports = router;
