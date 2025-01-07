
const crypto = require('crypto');

function generateString(length, characters){
    let str = "";
    for (let i=0; i<length; i++){
        str += characters.charAt(crypto.randomInt(0, characters.length));
    }
    return str; 
}

function generateCouponCode(couponLength){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
 
    return generateString(couponLength, characters);
}

function generateCouponpin( pinLength){
    const characters="0123456789";
    return generateString(pinLength, characters);
}

function generateCoupon(numCoupons, couponLength, pinLength){
    let coupons =[];
    for (let i=0; i<numCoupons; i++){
        coupons.push({ coupon: generateCouponCode(couponLength), pin: generateCouponpin(pinLength) });
    }
    return coupons;
}

module.exports ={
    generateCouponCode,
    generateCouponpin,
    generateCoupon
}