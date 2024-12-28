const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const {authMiddleWare} = require("../middleware");
const {Product ,User} = require("../db");   
const { ObjectId } = mongoose.Types;

router.post("/add-to-cart", authMiddleWare, async (req, res) =>{
const {productId, quantity , size, color} = req.body;
const userId = req.userId

try{
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid userId or productId" });
    }
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if(!product ||  !user){
        return res.status(403).json({
            message: "Please Add a valid Product/ Try logging in Again"
        })
    }
    const variations = product.variations.find(v=> v.size === size && v.color === color);

    if(!variations){
        return res.status(403).json({
            message: "Please select a valid size and color"
        })
    }
     
    const cartItem = user.cart.find(item => item.productId.equals(productId) && item.size === size && item.color === color);
    
    if (cartItem && variations.stock < cartItem.quantity + quantity) {
        return res.status(403).json({
            message: "Not enough stock available"
        });
    }
    if (!cartItem && variations.stock < quantity) {
        return res.status(403).json({
            message: "Not enough stock available"
        });
    }

    if(cartItem){
        cartItem.quantity += quantity
    }
    else{
        user.cart.push({
            productId,
            size,
            color,
            quantity
        })
    }
    await user.save();
    res.status(200).json({
        message: "Product added to cart successfully"
    })
}
catch (err) {
    res.status(500).json({ message: 'Error adding product to cart', error: err.message });
}
})

router.get("/view-cart", authMiddleWare, async (req, res) =>{
  try { const userId = req.userId;
    if(!ObjectId.isValid(userId)){
        return res.status(403).json({
            message: "Invalid User Id"
        })
    }
    const user =await User.findById(userId);
    if(!user){
        return res.status(403).json({
            message: "User not found"
        })
    }
    const cartItems = user.cart;
    res.status(200).json({
        message: "Success",
        cartItems
    })
   
}
    catch(err){
        res.status(500).json({ message: 'Error fetching cart items', error: err.message });
    }
})

module.exports = router;