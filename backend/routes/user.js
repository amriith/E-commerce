const jwt = require("jsonwebtoken");
const express = require('express');
const z = require('zod');
const router = express.Router();
const { User, Account } = require('../db');
const { JWT_SECRET } = require('../config');
const bcrypt = require("bcrypt");
const {authMiddleWare} = require("../middleware");
const { ObjectId } = require('mongoose').Types; 

const signUpBody = z.object({
   firstName: z.string(),
   lastName: z.string(),
   username: z.string().email(),
   password: z.string(),
   role: z.enum(['admin', 'user']).optional() 
});
const addressSchema = z.object({
    streetNumber: z.string(),
    streetName: z.string(),
    suburb: z.string(),
    state: z.string(),
    postcode: z.string(),
    country: z.string().optional(),
    landmark: z.string().optional(),
    status: z.string().optional()
});

router.post('/signup', async (req, res) => {
    const { success ,data} = signUpBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Invalid Inputs"
        });
    }

    const { firstName, lastName, username, password, role} = data;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User Already Exists"
            });
        }

        // Create a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword,
             role: role || 'user'
        });

        const userId = user._id;
        const fullName = `${user.firstName} ${user.lastName}`;
        const userRole = user.role;
        // Create a new account
        const account = await Account.create({
            userId: userId,
            Address: null,
            cart: 0
        });

        const cartItems = account.cart;

        // Generate JWT token
        const token = jwt.sign({
            userId,
            fullName,
            userRole
        },
         JWT_SECRET,{ expiresIn: '7h' });

        res.status(200).json({
            message: "Success",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});
const signInBody =z.object({
    username: z.string(),
    password: z.string()
})

router.post("/signin", async(req,res)=>{
    const { success ,data} = signInBody.safeParse(req.body);

    if(!success){
        res.status(400).json({
            message: "Invalid Inputs"
        });
    }
    const {username , password} = data;
   const user = await User.findOne({
        username
       })

       if(!user){
        return res.status(401).json({
            message: "Invalid username"
        })
       }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
    }
      
        const fullName = `${user.firstName} ${user.lastName}`;
        const userRole = user.role;
        const userId = user._id;
        const token = jwt.sign({
            userId, 
            userRole,
            username,
            fullName
        }, JWT_SECRET, { expiresIn: '7h' });

        res.status(200).json({
            message: "Success",
            token: token
        });
    
    
})
const updatedBody = z.object({
   password: z.string().optional(),
    firstname: z.string().optional(),
    lastName: z.string().optional()
 })

router.put("/update", authMiddleWare, async (req, res)=>{
    const {success, data} = updatedBody.safeParse(req.body);
     if(!success){
        return res.status(400).json({
            message: "Please enter valid credentials! "
        })
      }
    try { 
        const updateData = { ...data };

    if(updateData.password){
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
        const result =await User.updateOne(
        { _id: req.userId }, 
        { $set: updateData } 
    )
    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "No user found with the given ID."
        });
    }    
      if(result.modifiedCount === 0 ){
        return res.status(404).json({
            message: "No changes made."
        });
      }
      res.status(200).json({
        message: "User details successfully updated"
      })}
      catch (error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
      }
})

router.post("/add-address", authMiddleWare, async (req, res) => {
    const userId = req.userId;
    const { address } = req.body;

    try {
        // Validate userId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        const parsedResult = addressSchema.safeParse(address);
        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid address data",
                errors: parsedResult.error.errors,
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Wrap single address into an array
        const addressArray = Array.isArray(address) ? address : [address];
        for (const newAddress of addressArray){
        // Check if user can add more addresses

        if (!newAddress.streetNumber || !newAddress.streetName || !newAddress.suburb || !newAddress.state || !newAddress.postcode) {
            return res.status(400).json({
                message: "Invalid address format. Ensure all required fields are provided.",
            });

        }
        if (user.address.length >= 2) {
            return res.status(400).json({
                message: "You can only add up to 2 addresses.",
            });
        }
        
    const existingAddress = user.address.some(
            (a) => a.streetNumber === newAddress.streetNumber &&        
            a.streetName === newAddress.streetName &&
            a.suburb === newAddress.suburb &&
            a.state === newAddress.state &&
            a.postcode === newAddress.postcode
            );

        if (existingAddress) {
            return res.status(400).json({
                message: "Duplicate address detected. Cannot add duplicate addresses.",
            });
        }
            
               const validStates = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
               if (!validStates.includes(newAddress.state)) {
                return res.status(400).json({
                    message: "Invalid state value. Use one of: " + validStates.join(", "),
                });
            }

            if (user.address.length === 0) {
                newAddress.status = "primary";
            }
            user.address.push({
                streetNumber: newAddress.streetNumber,
                streetName: newAddress.streetName,
                suburb: newAddress.suburb,
                state: newAddress.state,
                postcode: newAddress.postcode,
                country: newAddress.country || "Australia",
                landmark: newAddress.landmark || "",
                status: newAddress.status || "secondary" 
            });
        }
        

        await user.save();

        res.status(200).json({
            message: "Address added successfully.",
            address: user.address,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});

router.post("/edit-address", authMiddleWare, async (req, res)=>{
const userId = req.userId;
const {address} = req.body; 

try{

    if(!ObjectId.isValid(userId)){
        return res.status(400).json({
            message: "Invalid User ID"
        });
    }   
    const parsedResult = addressSchema.safeParse(address);
        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid address data",
                errors: parsedResult.error.errors,
            });
        }

    const user = await User.findById(userId);
    const addressArray = Array.isArray(address) ? address : [address];
    for (const editAddress of addressArray){
        const missingFields = [];

    if (!editAddress.streetNumber) missingFields.push('streetNumber');
    if (!editAddress.streetName) missingFields.push('streetName');
    if (!editAddress.suburb) missingFields.push('suburb');
    if (!editAddress.state) missingFields.push('state');
    if (!editAddress.postcode) missingFields.push('postcode');
    if (!editAddress.status) missingFields.push('status');      


    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Invalid address format. Ensure all required fields are provided.",
            missingFields: missingFields
        });
        }

        const existingAddress = user.address.some(
            (a) => a.streetNumber === editAddress.streetNumber &&        
            a.streetName === editAddress.streetName &&
            a.suburb === editAddress.suburb &&
            a.state === editAddress.state &&
            a.postcode === editAddress.postcode
            );

        if (existingAddress) {
            return res.status(400).json({
                message: "Duplicate address detected. Cannot add duplicate addresses.",
            });
        }
        const validStates = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
        if (!validStates.includes(editAddress.state)) {
         return res.status(400).json({
             message: "Invalid state value. Use one of: " + validStates.join(", "),
         });
     }
     const addressToEdit = user.address.find((a) => a.status === editAddress.status);
     if (!addressToEdit) {
         return res.status(404).json({ message: `${editAddress.status} address not found.` });
     }

   
     addressToEdit.streetNumber = editAddress.streetNumber || addressToEdit.streetNumber;
     addressToEdit.streetName = editAddress.streetName || addressToEdit.streetName;
     addressToEdit.suburb = editAddress.suburb || addressToEdit.suburb;
     addressToEdit.state = editAddress.state || addressToEdit.state;
     addressToEdit.postcode = editAddress.postcode || addressToEdit.postcode;
     addressToEdit.country = editAddress.country || addressToEdit.country || "Australia";
     addressToEdit.landmark = editAddress.landmark || addressToEdit.landmark || "";
 }
    await user.save();
    return res.status(200).json({
        message: "Address updated successfully",
        address: user.address
    });

    }
    catch(err){
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }

})



module.exports = router;