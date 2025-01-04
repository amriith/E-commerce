const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const {authMiddleWare} = require("../middleware");
const {Product ,User,Order} = require("../db");   
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
    variations.reservedStock -= quantity;
    await user.save();
    await product.save();
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
router.post("/remove-item", authMiddleWare, async (req,res)=>{
    const {productId, quantity , size, color} = req.body;
    const userId = req.userId;

   try {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid userId or productId" });
    }
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) {
        return res.status(404).json({ message: "User or Product not found" });
    }
    const variations = product.variations.find(v => v.size===size && v.color === color);
    if(!variations){
        return res.status(403).json({
            message: "Please select a valid size and color"
        })
    }
    const cartItem = user.cart.find(i => i.productId.equals (productId) && i.size===size && i.color === color); 
    if (quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity specified" });
    }
    if (cartItem){


        if(cartItem.quantity > quantity){
            cartItem.quantity -=quantity;
            
        }
        else {
           user.cart = user.cart.filter(i => !(i.productId.equals(productId) && i.size === size && i.color === color)); 
           
        }
        variations.reservedStock += quantity;
         await user.save();
        await product.save();

        res.status(200).json({ message: 'Product removed from cart' });
    }
    else{
        return res.status(403).json({
            message: "Product not found in cart"
        })
    }

}
    catch(err){
        res.status(500).json({ message: 'Error removing product from cart', error: err.message });
    }
})

 router.post("/checkout", authMiddleWare, async (req, res)=>{
     const userId = req.userId;
     const session = await mongoose.startSession();
     try{

        if(!ObjectId.isValid(userId)){
            return res.status(403).json({
                message: "Invalid User Id"
            })
        }

        session.startTransaction();
        const user = await User.findById(userId).populate("cart.productId");
        if(!user || user.cart.length === 0){
            throw new Error("No items in cart/ User not found");
        }
        
        for (const cartItem of user.cart) {
           
        const productVariations = cartItem.productId.variations.find(i=>  i.size === cartItem.size && i.color === cartItem.color);
        
        if(!productVariations){
            throw new Error(`Product variation not found for size ${cartItem.size} and color ${cartItem.color}`);
            
        }
        if(productVariations.stock < cartItem.quantity){
            throw new Error(
                `Not enough stock available for ${cartItem.productId.name}. Available stock: ${productVariation.stock}`
            );
        }
        productVariations.stock -= cartItem.quantity;
        productVariations.reservedStock -= cartItem.quantity;
      
       

        const order = await Order.create({
            userId,
           products : user.cart,
           address: user.address,
           total: user.cart.reduce((acc, item) => acc + cartItem.quantity * item.productId.price, 0)
            })

        await order.save({ session });
        user.cart = [];
        await user.save({ session });
        await session.commitTransaction();
       

        res.status(200).json({
            message: "Checkout successful",
            orderId: order._id,
            total: order.total,
        });
    } 

    
 }
 catch(err){
    await session.abortTransaction(); // Rollback all operations
    session.endSession();
    res.status(500).json({ message: "Checkout failed", error: err.message });
 }
 finally {
    session.endSession();
}
})

module.exports = router;