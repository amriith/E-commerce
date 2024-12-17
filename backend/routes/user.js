const jwt = require("jsonwebtoken");
const express = require('express');
const z = require('zod');
const router = express.Router();
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');

const userBody = z.object({
   firstName: z.string(),
   lastName: z.string(),
   username: z.string().email(),
   password: z.string()
});

router.post('/signup', async (req, res) => {
    const { success } = userBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Invalid Inputs"
        });
    }

    const { firstName, lastName, username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User Already Exists"
            });
        }

        // Create a new user
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password
        });

        const userId = user._id;
        const fullName = `${user.firstName} ${user.lastName}`;

        // Create a new account
        const account = await Account.create({
            userId: userId,
            Address: null,
            cart: 0
        });

        const cartItems = account.cart;

        // Generate JWT token
        const token = jwt.sign({
            userId,
            fullName,
            cartItems
        }, JWT_SECRET);

        res.status(200).json({
            message: "Success",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = router;