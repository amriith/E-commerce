const express = require('express');
const userRouter = require('./user');
const productRouter = require('./product');
const cartRouter = require('./cart');
const orderRouter = require('./order'); 
const coupounRouter = require('./coupon');
 
const router = express.Router();
 

router.use('/user', userRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/coupon",coupounRouter);

module.exports = router ;