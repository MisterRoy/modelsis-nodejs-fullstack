const mongoose = require("mongoose");
const Joi = require("joi");

// Defining schema
const productTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  creationDate: Date,
});

// Compiling schema into a model
const ProductType = mongoose.model("ProductType", productTypeSchema);

function validateProductType(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(product);
}

exports.ProductType = ProductType;
exports.validateProductType = validateProductType;
