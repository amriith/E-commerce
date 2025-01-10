const express = require("express");
const router = express.Router();
const { Coupon, User } = require("../db");   
const { adminMiddleware, authMiddleWare } = require("../middleware");
const {  generateCoupon }= require("../utility/couponUtility");
const {calculateCartTotal } = require("../utility/applyCoupon");


router.post("/add-coupon", adminMiddleware, async(req, res)=>{
   const {discount, numCoupons, couponLength, pinLength} = req.body;
   
    try{
      if (!discount || !couponLength || !pinLength) {
        return res.status(400).json({ message: "Add details of  discount, validity, numCoupons, couponLength, pinLength " });
      }
      if (!numCoupons || numCoupons <= 0 || numCoupons > 1000 ) {
      return res.status(400).json({ message: "Invalid number of coupons requested." });
      }  
      if (!couponLength || couponLength <= 0 || couponLength > 20 ) {
      return res.status(400).json({ message: "Invalid coupon length requested." });
      }

      
      const couponsAndPins = generateCoupon(numCoupons, couponLength, pinLength);

      const couponGenerated= couponsAndPins.map(({coupon, pin}) =>({
         coupon,
         pin,
         discount
      }))

      await Coupon.insertMany(couponGenerated);
 
      res.status(200).json({
         message: "Coupons and PINs generated successfully",
         data: couponsAndPins,
     });
   }
    catch(err){
        
         return res.status(500).json({
               message: "Internal Server Error" + err

    })
   }
})

router.get("/apply-coupon", authMiddleWare, async(req,res)=>{
   const {coupon , pin} = req.body;
   const userId = req.userId;

   try{
      if(!coupon || !pin){
         return res.status(400).json({
            message: "Invalid Coupon/Pin"
         })
      }
      const user = await User.findById(userId);
  
      if(!user){
         return res.status(403).json({
            message: "Please login again"
         })
      }
      const {reducedTotal, discountAmount, finalTotal} =await calculateCartTotal(userId, coupon, pin);
      user.cartTotal = finalTotal;
       await user.save();  

      return res.status(200).json({
         message: "Coupon applied successfully.",
       data: {
         reducedTotal,
         discountAmount,
         finalTotal
         }
      })

   }
   catch(err){
      console.log(err);
      return res.status(500).json({
         message: "Internal Server Error"+ err
      })
   }
})

module.exports = router;

