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
    lastName: String
})

const accountSchema = mongoose.Schema({
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


const User = mongoose.model("User", userSchema);
const Account= mongoose.model("Account", accountSchema);
module.exports= {
    User,
    Account
}






