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
    address: { type: String, required: false }
})

const accountSchema =new mongoose.Schema({
    userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    address: { 
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
    address: { type: String, required: false },
    totalAmount: { type: Number, required: false },
    status: { type: String, enum: ['placed', 'shipped', 'delivered'], default: 'placed' }
});

const Order = mongoose.model("Order", OrderSchema);
const User = mongoose.model("User", userSchema);
const Account= mongoose.model("Account", accountSchema);
const Product = mongoose.model("Product", productSchema);
module.exports= {
    User,
    Account,
    Product,
    Order
}






