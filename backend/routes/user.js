const jwt = require("jsonwebtoken");
const express = require('express');
const z = require('zod');
const router = express.Router();
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const bcrypt = require("bcrypt");

const signUpBody = z.object({
   firstName: z.string(),
   lastName: z.string(),
   username: z.string().email(),
   password: z.string()
});

router.post('/signup', async (req, res) => {
    const { success ,data} = signUpBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        });
    }

    const { firstName, lastName, username, password } = data;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User Already Exists"
            });
        }

        // Create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword
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
            fullName
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
const signInBody =z.object({
    username: z.string(),
    password: z.string()
})

router.post("/signin", async(req,res)=>{
    const { success ,data} = signInBody.safeParse(req.body);

    if(!success){
        res.status(400).json({
            message: "Invalid Inputs"
        });
    }
    const {username , password} = data;
   const user = await User.findOne({
        username
       })

       if(!user){
        return res.status(401).json({
            message: "Invalid username"
        })
       }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
    }
      
        const fullName = `${user.firstName} ${user.lastName}`;
        const token = jwt.sign({
            username,
            fullName
        }, JWT_SECRET)

        res.status(200).json({
            message: "Success",
            token: token
        });
    
    
})

module.exports = router;