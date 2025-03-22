const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    farmerName: String,
    phoneNumber: String,
    works: [{
      cropName: String,
      location: String,
      category: String,
      image: String,
      price: Number,
      stock: Number,
      estimatedDeliveryTime: String
    }]
  });
  

  const Product = mongoose.model('farmers', productSchema);

module.exports = Product;
