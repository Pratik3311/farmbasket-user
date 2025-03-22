// Assuming you're using Express.js for your backend
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Oders'); 
const Product = require('../models/Products'); // Import the Product model

// Middleware to parse JSON
router.use(express.json());

// POST endpoint to create a new order
router.post('/', async (req, res) => {
  try {
    const { userId, products, shippingDetails } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products array is required and cannot be empty' });
    }
    
    if (!shippingDetails) {
      return res.status(400).json({ message: 'Shipping details are required' });
    }
    
    // Calculate total amount from products
    const totalAmount = products.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);

    // Create a new order with full product details
    const newOrder = new Order({
      userId,
      products: products.map(item => ({
        productId: item.productId,
        farmerId: item.farmerId,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity || 1,
        farmerName: item.farmerName
      })),
      shippingDetails: {
        name: shippingDetails.name,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        phone: shippingDetails.phone,
        zipcode: shippingDetails.zipcode
      },
      status: 'pending',
      totalAmount,
      orderDate: new Date()
    });
    
    // Save the order to the database
    const savedOrder = await newOrder.save();
    
    // Return success response
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: savedOrder._id,
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET endpoint to retrieve orders for a specific user with product details
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
        
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
        
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET endpoint to retrieve a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
        
    const order = await Order.findById(orderId);
        
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
        
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT endpoint to update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
        
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
        
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
        
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
        
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;