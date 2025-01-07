const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/mriid')
    .then(() => {
        console.log("MongoDB connection successful!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });




const userSchema =  mongoose.Schema({
    username: String,
    password : String,
    firstName : String,
    lastName: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    cart : [{
           productId :{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
           size: String,
              color: String,
                quantity: Number
    }],
    address: [
        {
            streetNumber: { type: String, required: true },
            streetName: { type: String, required: true },
            suburb: { type: String, required: true },
            state: { 
                type: String, 
                required: true, 
                enum: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'], 
            },
            postcode: { type: String, required: true },
            country: { type: String, default: "Australia" },
            landmark: { type: String, default: "" },
            status: {type: String, enum:["primary", "secondary"], default: "secondary"}
        }
    ]
})

const accountSchema =new mongoose.Schema({
    userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    address: { 
        ref: "User",
        type: String,
         required: false 
        },

    cart: {
        type: Number,
        required: true
    }
})
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    variations: [{
        size: { type: String, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true },
        reservedStock: { type: Number }
    }],
    description: String,    
    details: String,
    price: Number,
    category: String,
    subCategory: String,
    imageUrl: { type: String } 
})

productSchema.pre('save', function (next) {
    this.variations.forEach(variation => {
        if (variation.reservedStock === undefined) {
            variation.reservedStock = variation.stock;
        }
    });
    next();
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true }
    }],
    address: [{ type: String, ref: "User", required: true }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'shipped', 'delivered', 'return'], default: 'placed' },


    returns : [{
        productId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        size:{ type: String , require: true},
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        refundAmount: { type: Number, required: false },
        status: { type: String, enum: ["pending", "approved", "processed"], default: "pending" }
    }]
   
});

const couponSchema= new mongoose.Schema({
    coupon : { type: String, required: true },
    discount : { type: Number, required: true },
     pin : { type: String, required: true }
})

const Order = mongoose.model("Order", OrderSchema);
const User = mongoose.model("User", userSchema);
const Account= mongoose.model("Account", accountSchema);
const Product = mongoose.model("Product", productSchema);
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports= {
    User,
    Account,
    Product,
    Order,
    Coupon
}






