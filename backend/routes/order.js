const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const {authMiddleWare} = require("../middleware");
const {Order} = require("../db");
const { ObjectId } = mongoose.Types;

router.get("/order-history", authMiddleWare, async (req,res)=>{
    const userId =req.userId;
    
  try {  if(!ObjectId.isValid(userId)){
        return res.status(400).json({message:"Invalid userId"});
    }
    const userOrder =await Order.find({userId}).populate("products.productId", "name price description imageUrl");

    if (!userOrder || userOrder.length === 0) {
        return res.status(404).json({ message: "No order history found" });
    }
   return  res.status(200).json({
        orders: userOrder
    })
}
catch(err){
    console.log(err);
    return res.status(500).json({
        message: "Internal Server Error"
    })
}
})

router.post("/return", authMiddleWare, async(req, res)=>{
    const userId= req.userId;
    const {orderId ,productId, quantity , size, color} = req.body;
    const session = await mongoose.startSession();
    try {
    
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId) || !ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid User ID / Order ID / Product ID" });
        }

        session.startTransaction();

    
        const order = await Order.findOne({ _id: orderId, userId }).populate(
            "products.productId",
            "name price"
        );

        if (!order) {
            throw new Error("Order not found or does not belong to the user");
        }

        const orderItem = order.products.find(
            (item) =>
                item.productId._id.equals(productId) &&
                item.size === size &&
                item.color === color
        );

        if (!orderItem) {
            throw new Error("Product not found in the order");
        }

        if (quantity > orderItem.quantity || quantity<0) {
            throw new Error(`Invalid return quantity for product ${orderItem.productId.name}`);
        }

 
        const refundAmount = orderItem.productId.price * quantity;

    
        const returnDetails = {
            productId,
            size,
            color,
            quantity,
            status: "pending", 
            refundAmount,
        };

        order.returns.push(returnDetails);
        await order.save({ session });

     
        await session.commitTransaction();

        res.status(200).json({
            message: "Return request submitted successfully",
            returnDetails,
        });
    } catch (err) {
     
        await session.abortTransaction();
        res.status(500).json({ message: "Failed to process return request", error: err.message });
    } finally {
  
        session.endSession();
    }
});


module.exports = router;    
