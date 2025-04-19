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
      
      // Log a sample product to see its structure
      if (products.length > 0) {
        console.log('Sample product structure:', JSON.stringify(products[0], null, 2));
      }
      
      // Create a flattened array of all products from all farmers
      const flattenedProducts = [];
      products.forEach(product => {
        if (product.works && Array.isArray(product.works)) {
          product.works.forEach(work => {
            // Log the work object to see its structure
            console.log('Work object structure:', JSON.stringify(work, null, 2));
            
            // Check if images exist and log them
            if (work.images && Array.isArray(work.images)) {
              console.log('Images array:', JSON.stringify(work.images, null, 2));
            } else {
              console.log('No images array found in work object');
            }
            
            flattenedProducts.push({
              id: work._id || mongoose.Types.ObjectId().toString(),
              farmerId: product._id.toString(),
              farmerName: product.farmerName || 'Unknown Farmer',
              phoneNumber: product.phoneNumber || '',
              name: work.cropName || 'Unnamed Product',
              category: work.category || 'Other',
              price: work.price || 0,
              // Process images to ensure full URLs
              images: Array.isArray(work.images) ? work.images.map(img => {
                // If image is already a complete URL, use it
                if (img && typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
                  return img;
                }
                // Otherwise, use a placeholder
                return "https://via.placeholder.com/150";
              }) : [],
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
      
      // Log a sample flattened product
      if (flattenedProducts.length > 0) {
        console.log('Sample flattened product:', JSON.stringify(flattenedProducts[0], null, 2));
      }
  
      res.json(flattenedProducts);
    } catch (error) {
      console.error('Error in /api/products route:', error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
