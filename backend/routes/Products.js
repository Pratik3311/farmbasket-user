const express = require("express");
const router = express.Router();
const Product = require("../models/Products");

const mongoose = require("mongoose");


// Route to get all products
router.get('/', async (req, res) => {
    try {
      console.log('Fetching products from database...');
      const products = await Product.find({});
      console.log(`Found ${products.length} farmers in database`);
      
      // Create a flattened array of all products from all farmers
      const flattenedProducts = [];
      products.forEach(product => {
        if (product.works && Array.isArray(product.works)) {
          product.works.forEach(work => {
            flattenedProducts.push({
              id: work._id || mongoose.Types.ObjectId().toString(),
              farmerId: product._id.toString(),
              farmerName: product.farmerName || 'Unknown Farmer',
              phoneNumber: product.phoneNumber || '',
              name: work.cropName || 'Unnamed Product',
              category: work.category || 'Other',
              price: work.price || 0,
              image: work.image || '',
              location: work.location || 'Unknown Location',
              stock: work.stock || 0,
              estimatedDeliveryTime: work.estimatedDeliveryTime || '1-2 weeks'
            });
          });
        } else {
          console.log(`Warning: Farmer ${product.farmerName} has no works array or it's not an array`);
        }
      });
      console.log(`Sending ${flattenedProducts.length} flattened products to client`);
  
      res.json(flattenedProducts);
    } catch (error) {
      console.error('Error in /api/products route:', error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
