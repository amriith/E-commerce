const jwt = require("jsonwebtoken");
const express = require('express');
const z = require('zod');
const router = express.Router();
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const bcrypt = require("bcrypt");
const {authMiddleWare} = require("../middleware");

const signUpBody = z.object({
   firstName: z.string(),
   lastName: z.string(),
   username: z.string().email(),
   password: z.string(),
   role: z.enum(['admin', 'user']).optional() 
});

router.post('/signup', async (req, res) => {
    const { success ,data} = signUpBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        });
    }

    const { firstName, lastName, username, password, role} = data;

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
            password: hashedPassword,
             role: role || 'user'
        });

        const userId = user._id;
        const fullName = `${user.firstName} ${user.lastName}`;
        const userRole = user.role;
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
            userRole
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
        const userRole = user.role;
        const userId = user._id;
        const token = jwt.sign({
            userId, 
            userRole,
            username,
            fullName
        }, JWT_SECRET)

        res.status(200).json({
            message: "Success",
            token: token
        });
    
    
})
const updatedBody = z.object({
   password: z.string().optional(),
    firstname: z.string().optional(),
    lastName: z.string().optional()
 })

router.put("/update", authMiddleWare, async (req, res)=>{
    const {success, data} = updatedBody.safeParse(req.body);
     if(!success){
        return res.status(400).json({
            message: "Please enter valid credentials! "
        })
      }
    try { 
        const updateData = { ...data };

    if(updateData.password){
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
        const result =await User.updateOne(
        { _id: req.userId }, 
        { $set: updateData } 
    )
    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "No user found with the given ID."
        });
    }    
      if(result.modifiedCount === 0 ){
        return res.status(404).json({
            message: "No changes made."
        });
      }
      res.status(200).json({
        message: "User details successfully updated"
      })}
      catch (error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
      }
})

module.exports = router;