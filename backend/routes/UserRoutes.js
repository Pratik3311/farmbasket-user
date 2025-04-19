const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Register or update user
router.post("/api/orders", async (req, res) => {
    try {
        console.log("Incoming Order Request...");

        const { email, products, shippingDetails } = req.body;
        if (!email) {
            return res.status(400).json({ error: "User email is required" });
        }

        // Fetch userId from DB using email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;
        console.log("✅ Fetched User ID:", userId);

        // Proceed with order creation
        const order = new Order({
            userId, // Assign fetched userId
            products,
            shippingDetails
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("❌ Order Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create or update a user
router.post("/", async (req, res) => {
    try {
        const { userId, name, email, picture } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            user.name = name;
            user.picture = picture;
            user.lastLogin = new Date();
            await user.save();
            return res.status(200).json({ message: "User updated successfully", user });
        }

        // Create new user
        user = new User({ userId, name, email, picture });
        await user.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("❌ Error Saving User:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

module.exports = router;

// Get user by userId
router.get("/getUserId/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
