const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/mriid')



const userSchema =  mongoose.Schema({
    username: string,
    password : string,
    firstName : string,
    lastName: string
})

const accountSchema = mongoose.Schema({
    userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
    },
    Address: { 
        type: String,
         required: false 
        },

    cart: {
        type: number,
        required: true
    }
})


const User = mongoose.Model("User", userSchema);
const Account= mongoose.Model("Account", accountSchema);
module.exports= {
    User,
    Account
}






