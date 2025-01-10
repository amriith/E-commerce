const { Coupon, User } = require("../db");


const calculateCartTotal = async (userId,coupon, pin) => {
    try {
      
        const user = await User.findById(userId).populate("cart.productId");
        if (!user || !user.cart.length) {
            throw new Error("Cart is empty or user not found.");
        }

        const couponCheck = await Coupon.findOne({coupon, pin});
        if (!couponCheck) {
            throw new Error("Invalid coupon or pin."); 
        }
        if (couponCheck.used) {
            throw new Error("Coupon already used."); 
        }
      

       
        const reducedTotal = user.cart.reduce((accumulator, item) => accumulator + item.total, 0);
      
        const discountAmount = (couponCheck.discount / 100) * reducedTotal;
        const finalTotal = Math.max(0, reducedTotal - discountAmount);

        user.appliedCoupon = {
            coupon,
            pin,
            discountAmount,
            isApplied: true,
        };
     
        await user.save();
        return { reducedTotal, discountAmount, finalTotal };
       
    } catch (err) {
        console.error(err);
        throw new Error("Error calculating cart total.");
    }
};

module.exports = {
    calculateCartTotal
}