const express = require("express");
const router = express.Router();
const { Coupon } = require("../db");   
const { adminMiddleware } = require("../middleware");
const {  generateCoupon }= require("../utility/couponUtility");


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

module.exports = router;

