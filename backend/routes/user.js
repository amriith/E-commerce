
import { User, Account } from '../db';
const jwt = require("jsonwebtoken");
const express = require('express');
const z = require('zod');
const router = express.Router();
import { JWT_SECRET } from '../config';

const userBody = z.object({
   firstName : z.string(),
   lastName: z.string(),
   username : z.string().email(),
   password : z.string()
})

 router.post('/signup', async(req,res)=>{
    const {success} = userBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            "message": "Invalid Inputs"
        })
    }

    
       const existingUser = await User.findOne({
            username : req.body.username
        })
        if (existingUser){
            return res.status(400).json({
                message: "User Already Exists"
            })

        }
       const user = await User.create({
            firstName,
            lastName,
            username,
            password
            })

            const userId = user._id;
            const fullName = `${user.firstName} ${user.lastName}`;
           const account = Account.create({
            userId :userId,
            Address :null,
            cart : 0
 
           })
           const cartItems = account.cart;
           const token = jwt.sign({
            userId,
            fullName,
            cartItems
           }, JWT_SECRET)

        res.status(200).json({
            message: "Success",
            token: token
        })
 })