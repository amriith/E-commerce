const express = require("express");
const mongoose = require('mongoose');
import { Coupon } from "../db";
const router = express.Router();
const { adminMiddleware } = require("../middleware");
const { ObjectId } = mongoose.Types;
const crypto = require("crypto");


router.post("/add-coupon", adminMiddleware, async(req, res)=>{
   const {dicount,validity} = req.body;
   
    try{
      if (!dicount || !validity) {
        return res.status(400).json({ message: "Add a valid discount and validity in months" });
     }
     length = 6;
     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let couponCode = "";


    }
    catch{

    }
})


