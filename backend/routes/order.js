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


module.exports = router;    