const mongoose = require("mongoose");
const Joi = require("joi");

// Defining schema
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  creationDate: Date,
  type: {
    type: String,
    required: true,
  },
});

// Compiling schema into a model
const Product = mongoose.model("produt", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
  });
  return schema.validate(product);
}

exports.Product = Product;
exports.validateProduct = validateProduct;
