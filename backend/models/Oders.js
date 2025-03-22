const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order Schema with enhanced product details
const OrderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: String,
        required: true
      },
      farmerId: {
        type: String,
        required: true
      },
      // Add product details for easier reference without joins
      name: String,
      price: Number,
      image: String,
      category: String,
      quantity: {
        type: Number,
        default: 1
      },
      farmerName: String
    }
  ],
  shippingDetails: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);