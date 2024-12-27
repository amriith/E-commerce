const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/mriid', {
    useNewUrlParser : true,
    useUnifiedTopology: true
})
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
    }]
})

const accountSchema =new mongoose.Schema({
    userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    Address: { 
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
        stock: { type: Number, required: true }
    }],
    description: String,    
    details: String,
    price: Number,
    category: String,
    subCategory: String,
    imageUrl: { type: String } 
})


const User = mongoose.model("User", userSchema);
const Account= mongoose.model("Account", accountSchema);
const Product = mongoose.model("Product", productSchema);
module.exports= {
    User,
    Account,
    Product
}






